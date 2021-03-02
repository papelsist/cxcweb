package sx.cxc

import groovy.util.logging.Slf4j

import grails.gorm.transactions.Transactional
import org.apache.commons.lang3.exception.ExceptionUtils

import lx.cfdi.v33.Comprobante
import com.luxsoft.cfdix.v33.NotaBuilder
import sx.core.Sucursal
import sx.core.Folio
import sx.cfdi.Cfdi
import sx.cfdi.CancelacionDeCfdi
import sx.core.Venta
import sx.inventario.DevolucionDeVenta
import sx.core.LogUser
import sx.core.AppConfig
import sx.cfdi.CfdiService
import sx.cfdi.CancelacionService
import sx.cfdi.CfdiTimbradoService
import sx.utils.MonedaUtils

@Transactional
@Slf4j
class NotaDeCreditoService implements LogUser{

    NotaBuilder notaBuilder

    CfdiService cfdiService

    CfdiTimbradoService cfdiTimbradoService

    CancelacionService cancelacionService

    Sucursal sucursal = null

    /**
    * Persiste la nota de crédito asignandole folio
    */
    def save(NotaDeCredito nota) {
        if(nota.id) throw new NotaDeCreditoException("Nota existente Id: ${nota.id}");
        nota.folio = Folio.nextFolio('NOTA_DE_CREDITO', nota.serie)
        logEntity(nota)
        nota.save failOnError: true, flush: true
    }

    def update(NotaDeCredito nota) {
        logEntity(nota)
        if(nota.tipo == 'DEVOLUCION')
          return registrarDevolucion(nota)
        nota.save failOnError: true, flush: true
        return nota
    }

    def registrarDevolucion(NotaDeCredito nota) {
      DevolucionDeVenta rmd = nota.devolucion
      if(rmd == null) {
        throw new NotaDeCreditoException("La Nota ${nota.folio} no tiene asignada una devolucion de venta (RMD) ")
      }
      if (rmd.cobro && nota.tipoCartera == 'CRE') {
        throw new NotaDeCreditoException("RMD ${rmd.documento} ${rmd.sucursal} Ya tiene nota de credito generada")
      }
      log.info('Registrando ')
      nota.sucursal = rmd.sucursal
      if(rmd.venta.moneda != 'MXN') {
        Venta venta = rmd.venta
        nota.moneda = rmd.venta.moneda
        if(venta.cuentaPorCobrar.saldo <= 0.0) {
          // Venta Pagada
          AplicacionDeCobro apliacion = AplicacionDeCobro.where{cuentaPorCobrar == venta.cuentaPorCobrar}.find()
          nota.tc = apliacion.cobro.tipoDeCambio
        } else {
          nota.tc = rmd.venta.tipoDeCambio
        }
      }
      nota.importe = rmd.importe
      nota.impuesto = rmd.impuesto
      nota.total = rmd.total
      nota.comentario = "RMD:${rmd.documento} ${rmd.venta.cuentaPorCobrar.tipo} " +
                "F-${rmd.venta.cuentaPorCobrar.documento} " +
                "(${rmd.venta.cuentaPorCobrar.fecha.format('dd/MM/yyyy')}) " +
                "${rmd.sucursal.nombre}"
      // Generar partida
      // nota.addToPartidas()

      if (nota.tipoCartera == 'CRE'){
        /* YA NO SE REQUIERE EL COBRO SE GENERA  AL TIMBRAR
        log.debug('Generando cobro para nota de devoluion tipo {}', nota.tipoCartera)
        Cobro cobro = generarCobro(nota)
        nota.cobro = cobro
        nota.save failOnError: true, flush: true
        // aplicar(nota)
        rmd.cobro = cobro
        rmd.save failOnError: true, flush: true
        return nota
        */
      } else {
        nota.cobro = rmd.cobro
        nota.save failOnError: true, flush: true
        return nota
      }
    }

    def generarCfdi(NotaDeCredito nota) {
        Comprobante comprobante = this.notaBuilder.build(nota);
        Cfdi cfdi = cfdiService.generarCfdi(comprobante, 'E', 'NOTA_CREDITO')
        return cfdi
    }

    def timbrar(NotaDeCredito nota){
        try {
            def cfdi = generarCfdi(nota)
            cfdi = cfdiTimbradoService.timbrar(cfdi)
            nota.cfdi = cfdi
            if(nota.tipo == 'DEVOLUCION'){
              if(nota.tipoCartera == 'CRE') {
                nota.cobro = generarCobro(nota)
              } else {
                // Vincular cobro existente desde el rmd
                DevolucionDeVenta rmd = nota.devolucion
                nota.cobro = rmd.cobro
              }
            } else {
              nota.cobro = generarCobro(nota)
            }
            nota.save failOnError: true, flush: true
            return nota
        } catch (Throwable ex){
            ex.printStackTrace()
            throw  new NotaDeCreditoException(ExceptionUtils.getRootCauseMessage(ex))
        }
    }


    private generarCobro(NotaDeCredito nota) {
      Cobro cobro = new Cobro()
      cobro.setCliente(nota.cliente)
      cobro.setFecha(new Date())
      cobro.importe = nota.total
      cobro.moneda = nota.moneda
      cobro.tipoDeCambio = nota.tc
      cobro.tipo = nota.tipoCartera
      cobro.comentario = nota.comentario
      cobro.createUser = nota.createUser
      cobro.updateUser = nota.updateUser
      cobro.sucursal = nota.sucursal
      cobro.referencia = nota.folio.toString()
      cobro.formaDePago = nota.tipo
      cobro.save failOnError: true, flush: true
      if(nota.devolucion) {
        DevolucionDeVenta rmd = nota.devolucion
        rmd.cobro = cobro
        rmd.save failOnError: true, flush: true
      }
      return cobro
    }

    def aplicar(NotaDeCredito nota) {
        Cobro cobro = nota.cobro
        log.debug('Aplicando cobro con disponible:{}', cobro.disponible)
        if(cobro.disponible > 0.0) {
            if(nota.tipo.startsWith('BON')){
                this.aplicarCobroDeBonificacion(nota)
            } else {
                this.aplicarCobroDeDevolucion(nota)
            }
            cobro.save flush: true
            cobro.refresh()
            return nota
        }
    }

    public aplicarCobroDeBonificacion(NotaDeCredito nota) {
        Cobro cobro = nota.cobro
        BigDecimal disponible = cobro.getDisponible()
        BigDecimal porAplicar = nota.partidas.sum 0.0, { it.importe}
        if(disponible < porAplicar) {
            throw new NotaDeCreditoException("Nota inconsistente para a plicar a sus relacionados " +
                    "Disponible:${disponible} Monto por aplicar: ${porAplicar}")
        }
        nota.partidas.each { NotaDeCreditoDet det ->
            CuentaPorCobrar cxc = det.cuentaPorCobrar
            if (cxc.saldo >= det.importe) {
                def aplicacion = new AplicacionDeCobro()
                aplicacion.cuentaPorCobrar = cxc
                aplicacion.fecha = new Date()
                aplicacion.importe = det.total
                cobro.addToAplicaciones(aplicacion)
                if(!cobro.primeraAplicacion) {
                    cobro.primeraAplicacion = aplicacion.fecha
                }
            }
        }
    }

    public aplicarCobroDeDevolucion(NotaDeCredito nota) {
        Cobro cobro = nota.cobro
        DevolucionDeVenta rmd = DevolucionDeVenta.where{ cobro == cobro}.find()
        if (rmd == null) {
            return
        }
        CuentaPorCobrar cxc = rmd.venta?.cuentaPorCobrar
        if (cxc) {
            BigDecimal saldo = cxc.saldo
            if(saldo > 0) {
                def importe = cobro.disponible <= saldo ? cobro.disponible : saldo
                def aplicacion = new AplicacionDeCobro()
                aplicacion.cuentaPorCobrar = cxc
                aplicacion.fecha = new Date()
                aplicacion.importe = importe
                cobro.addToAplicaciones(aplicacion)
                if(!cobro.primeraAplicacion) {
                    cobro.primeraAplicacion = aplicacion.fecha
                }
            }
        }
    }

    def eliminar(NotaDeCredito nota) {
        if(nota.cfdi ){
          throw new NotaDeCreditoException('Nota de credito timbrada no se puede eliminar')
        }

        Cobro cobro = nota.cobro
        nota.cobro = null

        if(nota.devolucion) {
          DevolucionDeVenta rmd = nota.devolucion
          rmd.cobro = null
          rmd.save flush: true
        }

        if(cobro) {
          cobro.delete flush: true
        }
        nota.delete flush:true

        /*
        if(nota.tipoCartera == 'CRE'  || nota.tipo.startsWith('BON')) {
            if(nota.tipo.startsWith('DEV') ){
                DevolucionDeVenta rmd = nota.devolucion
                rmd.cobro = null
                rmd.save()
            }
            if(cobro)
                cobro.delete flush: true
        }
        */
    }

    def cancelar(NotaDeCredito nota, String motivo) {
        // throw new UnsupportedOperationException('Aun no es posible cancelar Notas de Credito en esta version del sistema')
        if(!nota.cfdi) throw new RuntimeException('Nota sin CFDI generado no se puede cancelar')
        if(!nota.cfdi.uuid) throw new RuntimeException('Nota con CFDI sin timbrar no se puede cancelar')
        // if(nota.cobro.aplicado > 0.0) throw new RuntimeException('Nota con aplicaciones no se puede cancelar. Primero debe cancelar las aplicaciones registradas')

        Cfdi cfdi = nota.cfdi
        // cfdi.status = 'CANCELACION_PENDIENTE'
        //cfdi.save flush: true
        CancelacionDeCfdi cancelacion = cancelacionService.cancelarCfdi(cfdi)

        Cobro cobro = nota.cobro
        nota.cobro = null
        if(cobro) {
            if(nota.tipo.startsWith('DEV') ){
                DevolucionDeVenta rmd = DevolucionDeVenta.where{cobro == cobro}.find()
                rmd.cobro = null
                rmd.save flish: true
            }
            cobro.delete flush: true
        }

        nota.cancelacion = new Date()
        nota.cancelacionMotivo = motivo
        nota.cancelacionUsuario = getCurrentUserName()
        nota.save flush: true
    }

    Sucursal getSucursal() {
        if(!this.sucursal) {
            this.sucursal = AppConfig.first().sucursal
        }
        return this.sucursal
    }




}

class NotaDeCreditoException  extends RuntimeException {

    NotaDeCreditoException(String message){
        super(message)
    }

}
