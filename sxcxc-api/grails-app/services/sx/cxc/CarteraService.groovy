package sx.cxc

import groovy.util.logging.Slf4j

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured

import grails.gorm.transactions.Transactional

@GrailsCompileStatic
@Slf4j
class CarteraService {

  List<CuentaPorCobrar> getCartera(String cartera) {
    List<CuentaPorCobrar> rows = CuentaPorCobrar.findAll("""
      from CuentaPorCobrar c where c.tipo = :tipo and c.saldoReal > 0
      order by c.fecha
    """, [tipo: cartera])
    // List<CuentaPorCobrarDTO> res = rows.collect { cxc -> new CuentaPorCobrarDTO(cxc)}
    return rows
  }

  @Transactional
  List<CuentaPorCobrar> updateCartera(String tipo) {
    List<CuentaPorCobrar> facturas = getCartera(tipo)
    Date actualizacion = new Date()
    facturas.each { cxc ->
      cxc.saldoActualizado = cxc.saldoReal.toDouble()

      // Actializando Venta credito

      cxc.credito.actualizacion = actualizacion
      cxc.credito.saldo = cxc.saldoReal.toDouble()
      cxc.credito.atraso = cxc.atrasoCalculado
      cxc.save()
    }
    return facturas
  }
}
