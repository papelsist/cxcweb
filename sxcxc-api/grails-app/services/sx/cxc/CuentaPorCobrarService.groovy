package sx.cxc

import groovy.util.logging.Slf4j
import grails.plugin.springsecurity.annotation.Secured
import grails.gorm.transactions.Transactional
import grails.gorm.transactions.ReadOnly

import sx.core.Cliente
import sx.core.AppConfig
import sx.utils.Periodo

@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
@Slf4j
class CuentaPorCobrarService {

    @Transactional
    CuentaPorCobrar saldar(CuentaPorCobrar cxc) {
        if (cxc.saldo > 0.0 && cxc.saldo <= 100.00) {
            Date fecha = new Date()
            Cobro cobro = new Cobro()
            cobro.sucursal = AppConfig.first().sucursal
            cobro.fecha = fecha
            cobro.tipo = cxc.tipo
            cobro.formaDePago = 'PAGO_DIF'
            cobro.importe = cxc.saldo
            cobro.fechaDeAplicacion = fecha
            cobro.referencia = cxc.folio
            cobro.cliente = cxc.cliente

            AplicacionDeCobro aplicacionDeCobro = new AplicacionDeCobro()
            aplicacionDeCobro.importe = cxc.saldo
            aplicacionDeCobro.formaDePago = 'PAGO_DIF'
            aplicacionDeCobro.fecha = fecha
            aplicacionDeCobro.cuentaPorCobrar = cxc
            cobro.addToAplicaciones(aplicacionDeCobro)
            cobro.save failOnError: true, flush: true

        }
        return cxc
    }

    @ReadOnly
    List<CuentaPorCobrarDTO> findAll(String cartera, Periodo periodo, Map params = [max: 100] ) {
        List<CuentaPorCobrar> rows = CuentaPorCobrar
          .findAll(
          """from CuentaPorCobrar c
            where c.fecha between :fechaInicial and :fechaFinal
              and c.tipo = :tipo
              order by c.fecha
          """
          , [tipo: cartera == 'CON' ? 'COD' : cartera,
          fechaInicial:periodo.fechaInicial,
          fechaFinal:periodo.fechaFinal]
          , params)
        List<CuentaPorCobrarDTO> res = rows.collect { cxc -> new CuentaPorCobrarDTO(cxc)}
        log.info('Registros de cartera: {}', res.size())
        return res
    }

    @ReadOnly
    List<CuentaPorCobrarDTO> findAllPendientes(String cartera) {
      if(cartera == 'CRE') {
        log.debug('Localizando facturas pendientes de CRE')
        List<CuentaPorCobrar> rows = CuentaPorCobrar
          .findAll(
            """from CuentaPorCobrar c where c.tipo = :tipo and c.saldoReal > 0
              order by c.fecha
            """
          , [tipo: cartera])
        List<CuentaPorCobrarDTO> res = rows.collect { cxc -> new CuentaPorCobrarDTO(cxc)}
        log.info('Registros de cartera: {} = {}', cartera, res.size())
        return res
      } else {
        log.debug('Localizando facturas pendientes de COD')
        List<CuentaPorCobrar> rows = CuentaPorCobrar
          .findAll(
            """from CuentaPorCobrar c
            where c.tipo = :tipo
              and date(c.fecha) > :desde
              and c.saldoReal > 0
              order by c.fecha
            """
          , [tipo: 'COD', desde: (new Date() - 30) ])
        List<CuentaPorCobrarDTO> res = rows.collect { cxc -> new CuentaPorCobrarDTO(cxc)}
        log.info('Registros de cartera: {} = {}', 'COD', res.size())
        return res
      }
    }

    @ReadOnly
    List<CuentaPorCobrarDTO> findPendientes(Cliente cliente, String cartera = null) {
      if(cartera == null) {
        List<CuentaPorCobrar> rows = CuentaPorCobrar
                .findAll(
                """from CuentaPorCobrar c
                    where c.cliente.id = :clienteId
                      and c.saldoReal > 0
                      and c.cfdi is not null
                    order by c.fecha
                """
                , [clienteId: cliente.id])
        List<CuentaPorCobrarDTO> res = rows.collect { cxc -> new CuentaPorCobrarDTO(cxc)}
        log.info(' {} Facturas pendientes para : {} ',res.size(), cliente.nombre)
        return res
      } else {
        List<CuentaPorCobrar> rows = CuentaPorCobrar
                .findAll(
                """from CuentaPorCobrar c
                    where c.cliente.id = :clienteId
                      and c.saldoReal > 0
                      and c.tipo = :cartera
                    order by c.fecha
                """
                , [clienteId: cliente.id, cartera: cartera])
        List<CuentaPorCobrarDTO> res = rows.collect { cxc -> new CuentaPorCobrarDTO(cxc)}
        log.info(' {} Facturas pendientes para : {} ',res.size(), cliente.nombre)
        return res

      }
    }

    @ReadOnly
    List<CuentaPorCobrarDTO> findFacturas(Cliente cliente, Periodo periodo) {
      List<CuentaPorCobrar> rows = CuentaPorCobrar
              .findAll(
              """from CuentaPorCobrar c
                  where c.cliente.id = :clienteId
                    and c.fecha between :f1 and :f2
                    and c.saldoReal > 0
                    and c.cfdi is not null
                  order by c.fecha
              """
              , [clienteId: cliente.id, fechaInicial: periodo.fechaInicial, f2: periodo.fechaFinal])
      List<CuentaPorCobrarDTO> res = rows.collect { cxc -> new CuentaPorCobrarDTO(cxc)}
      log.info(' {} Facturas pendientes para : {} ',res.size(), cliente.nombre)
      return res
    }
}

