package sx.cxc

import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional

import org.apache.commons.lang3.exception.ExceptionUtils

import com.luxsoft.cfdix.v33.ReciboDePagoBuilder
import com.cfdi4.Cfdi4PagoBuilder
import lx.cfdi.v33.Comprobante
import sx.cfdi.Cfdi
import sx.cfdi.CfdiService
import sx.cfdi.Cfdi4Service
import sx.cfdi.CancelacionService
import sx.cfdi.CfdiTimbradoService
import sx.core.Cliente
import sx.core.Folio
import sx.core.LogUser

@Transactional
class CobroService implements LogUser{

    ReciboDePagoBuilder reciboDePagoBuilder

    CfdiService cfdiService

    Cfdi4Service cfdi4Service

    Cfdi4PagoBuilder cfdi4PagoBuilder

    CfdiTimbradoService cfdiTimbradoService

    CancelacionService cancelacionService

    Cobro update(Cobro cobro) {
        log.info('Actualizando cobro: {}', cobro.id)
        if(cobro.cfdi && cobro.cfdi.uuid) {
            throw new ReciboDePagoExistenteException(cobro)
        }
        logEntity(cobro)
        cobro.save failOnError: true, flush:true
    }

    def generarCobroDeContado(CuentaPorCobrar cxc, List<Cobro> cobros) {
        def saldo = cxc.saldo
        cobros.each { cobro ->
            def disponible = cobro.disponible
            def importe = disponible < saldo ? disponible : saldo
            def aplicacion = new AplicacionDeCobro()
            aplicacion.cuentaPorCobrar = cxc
            aplicacion.fecha = new Date()
            aplicacion.importe = importe
            cobro.addToAplicaciones(aplicacion)
            disponible = disponible - aplicacion.importe

            if(disponible < 10 && disponible > 0.01) {
                cobro.diferencia = disponible
                cobro.diferenciaFecha = new Date()
            }
            setComisiones(cobro)
            cobro.save failOnError: true, flush: true
            saldo = saldo - importe
        }
        return cxc
    }

    def registrarAplicacion(Cobro cobro, List<CuentaPorCobrar> pendientes){
        def fecha = new Date()
        def disponible = cobro.saldo
        if (disponible <= 0)
            return cobro
        pendientes.each { cxc ->
            def saldo = cxc.saldo
            if (disponible > 0) {
                def importe = saldo <= disponible ? saldo : disponible
                AplicacionDeCobro aplicacion = new AplicacionDeCobro()
                aplicacion.importe = importe
                aplicacion.formaDePago = cobro.formaDePago
                aplicacion.cuentaPorCobrar = cxc
                aplicacion.fecha = fecha
                aplicacion.moneda = cxc.moneda.getCurrencyCode()
                // aplicacion.tipoDeCambio = cxc.tipoDeCambio
                aplicacion.tipoDeCambio = cobro.tipoDeCambio
                cobro.addToAplicaciones(aplicacion)
                if(cobro.primeraAplicacion == null){
                    cobro.primeraAplicacion = fecha
                    logEntity(cobro)
                }
                logEntity(aplicacion)
                disponible = disponible - importe
            }
        }
        cobro.save flush: true
        return cobro
    }

    Cobro eliminarAplicacion(Cobro cobro, List<AplicacionDeCobro> aplicaciones) {
        if(cobro.cfdi) {
            throw new CobroException(
                """Cobro con recibo de pago UUID: ${cobro.cfdi.uuid} No se puede modificar""",
                cobro)
        }
        aplicaciones.each { aplicacion ->
            cobro.removeFromAplicaciones(aplicacion)
        }
        if(!cobro.aplicaciones) {
            cobro.primeraAplicacion = null
            logEntity(cobro)
        }
        cobro.save failOnError: true, flush: true
        return cobro
    }

    def saldar(Cobro cobro){
      if(cobro.disponible <= 100.00 && cobro.disponible > 0.00) {
        cobro.diferencia = cobro.disponible;
        cobro.diferenciaFecha = new Date()
        cobro = cobro.save flush: true
      }
      return cobro
    }


    /*
    def generarCfdi(Cobro cobro) {
        validarParaTimbrado(cobro)
        log.debug(' Generando recibo electronico de pago para cobro: {}', cobro.id)
        Comprobante comprobante = this.reciboDePagoBuilder.build(cobro)

        Cfdi cfdi = cfdiService.generarCfdi(comprobante, 'P', 'COBROS')
        log.debug('CFDI generado {}', cfdi.id)
        cobro.cfdi = cfdi
        cobro.save flush: true
        return cobro
    }
    */

    def generarCfdi(Cobro cobro) {
      validarParaTimbrado(cobro)
      Comprobante comprobante = this.reciboDePagoBuilder.build(cobro)
      Cfdi cfdi = cfdiService.generarCfdi(comprobante, 'P', 'COBROS')
      return cfdi
    }

    def generarCfdiV4(Cobro cobro) {
      println "Generando el cfdi V4 para ${cobro.id}"
      //validarParaTimbrado(cobro)
      def comprobante = this.cfdi4PagoBuilder.build(cobro)
      Cfdi cfdi = cfdi4Service.generarCfdi(comprobante, 'P', 'COBROS')
      return cfdi 
    }

    def timbrarV4(Cobro cobro){
      println "Timbrando un cobro en V4 ${cobro.id}"
      try{

        def cfdi = generarCfdiV4(cobro)
        cfdi = cfdiTimbradoService.timbrar(cfdi)
        cobro.cfdi = cfdi
        cobro = cobro.save failOnError: true, flush: true
        return cobro

      }catch (Throwable ex){
        String causa = ExceptionUtils.getRootCauseMessage(ex)
        String message = "Error generando y timbrando recibo de pago cobroId:${cobro.id} Causa: ${causa}"
        log.error(message)
         throw  new ReciboDePagoException(cobro, message)
      }
    }

    def timbrar(Cobro cobro){
      try {
        def cfdi = generarCfdi(cobro)
        cfdi = cfdiTimbradoService.timbrar(cfdi)
        cobro.cfdi = cfdi
        cobro = cobro.save failOnError: true, flush: true
        return cobro
      } catch (Throwable ex){
        String causa = ExceptionUtils.getRootCauseMessage(ex)
        String message = "Error generando y timbrando recibo de pago cobroId:${cobro.id} Causa: ${causa}"
        log.error(message)
        throw  new ReciboDePagoException(cobro, message)
      }
    }

    def validarParaTimbrado(Cobro cobro) {

        if(!cobro.aplicaciones) {
            throw new CobroException("El cobro debe tener al menos una a plicacion", cobro)
        }
        def sinCfdi = cobro.aplicaciones.find {AplicacionDeCobro det -> det.cuentaPorCobrar.cfdi == null}

        if(sinCfdi) {
            throw new CobroException("La factura ${sinCfdi.getFolio()} esta sin timbrar")
        }

        AplicacionDeCobro contado = cobro.aplicaciones.find{AplicacionDeCobro det -> det.cuentaPorCobrar.tipo == 'CON' }
        if(contado) {
            throw new CobroException("El cobro ${cobro.id} tiene aplicaciones de a facturas de CONTADO")
        }

    }

  def cancelarRecibo(Cobro cobro, String motivo) {
    def cfdi = cobro.cfdi
    def cancelacion = cancelacionService.cancelarCfdi(cfdi, false)
    cobro.cancelacionDeCfdi = cancelacion
    cobro.cancelacionMotivo = motivo
    cobro.cfdi = null
    cobro = cobro.save flush: true
    logEntity(cobro)
    return cobro
  }

}

class CobroException  extends RuntimeException {

    Cobro cobro

    CobroException(String message) {
        super(message)
    }
    CobroException(String message, Cobro c) {
        super(message)
        this.cobro = c
    }
}

class ReciboDePagoExistenteException extends CobroException {

  ReciboDePagoExistenteException(Cobro c) {
    super("Recibo de pago para cobro: ${c.id} ya ha sido Generado y Timbrado con el UUID: ${c.cfdi.uuid}", c)
  }

}

class ReciboDePagoException extends CobroException {

  ReciboDePagoException(Cobro c, String message) {
    super(message, c)
  }

}
