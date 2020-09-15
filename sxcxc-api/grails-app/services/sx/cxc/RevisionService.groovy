package sx.cxc

import groovy.util.logging.Slf4j

import grails.gorm.transactions.Transactional

import org.apache.commons.lang3.exception.ExceptionUtils

import sx.core.LogUser

@Slf4j
class RevisionService implements LogUser {

  @Transactional
  VentaCredito update(VentaCredito credito, boolean recalcular = true) {
    if(recalcular)
      this.actualizarRevision(credito)
    credito = credito.save flush: true
    return credito
  }


  List<VentaCredito> buscarPendientes(){
    def rows = VentaCredito.findAll("""
      from VentaCredito v
      where v.saldo > 0.0
      order by v.nombre, v.fechaRevision
      """)
    return rows

  }
  List<VentaCredito> buscarPendientesOld(){
    def rows = VentaCredito.findAll("""
      from VentaCredito v
      where v.cuentaPorCobrar.tipo = :cartera
        and v.cuentaPorCobrar.saldoReal > 0.0
        and v.cuentaPorCobrar.cfdi.uuid is not null
        and v.cuentaPorCobrar.cancelada is null
      order by v.cuentaPorCobrar.cliente.nombre, v.fechaRevision
      """, [cartera:'CRE'])
    return rows

  }

  /**
    * Actualiza los correspondientes a reviision y cobro para las cuentas por cobrar
    *
    * @return Lista de ventaCredito de las cuentas actualizadas
    */
  @Transactional
  public List<VentaCredito> actualizar(){
    log.debug('Actualizando facturas de credito para revisión y pago')
    List<CuentaPorCobrar> facturas = CuentaPorCobrar.findAll("""
      from CuentaPorCobrar c
        where  c.tipo = :cartera
        and c.saldoReal > 0
        and c.cfdi.uuid is not null
        and c.cancelada is null
        order by c.cliente.nombre, c.fecha desc
        """,
        [cartera:'CRE'])
    log.debug('Facturas: {}', facturas.size())
    List<VentaCredito> rows =  []
    Date actualizacion = new Date()
    facturas.each { cxc ->

      if(cxc.credito == null)
        cxc.credito = generarVentaCredito(cxc)

      cxc.credito.nombre = cxc.cliente.nombre
      cxc.credito.actualizacion = actualizacion
      cxc.credito.saldo = cxc.saldoReal
      cxc.credito.atraso = cxc.atrasoCalculado

      actualizarRevision(cxc.credito)

      cxc = cxc.save failOnError: true, flush: true
      rows << cxc.credito
    }
    log.debug('Ventas de credito actualizadas: {}', rows.size())
    return rows
  }



  /**
    *
    * @param cxc La cuenta por cobrar
    * @return La VentaCredito correspondiente
    */
  // @Transactional
  VentaCredito generarVentaCredito(CuentaPorCobrar cxc) {

    if(cxc.credito)
      return cxc.credito
    log.debug('Generando registro de VentaCredito para CxC: {}', cxc.folio)

    VentaCredito credito = new VentaCredito()
    credito.nombre = cxc.cliente.nombre
    // Propiedades
    credito.diaPago = cxc.cliente.credito.diaCobro
    credito.diaRevision = cxc.cliente.credito.diaRevision
    credito.plazo = cxc.cliente.credito.plazo
    credito.revisada = false
    credito.revision = cxc.cliente.credito.revision
    credito.cobrador = cxc.cliente.credito.cobrador
    credito.socio = cxc.cliente.credito.socio
    // Fechas
    Date vto = cxc.fecha + cxc.cliente.credito.plazo.intValue()
    cxc.vencimiento = vto
    credito.vencimiento = vto
    // Se congela la fecha original de revision
    credito.fechaRevisionCxc = getProximaRevision(cxc.fecha, cxc.cliente.credito.diaRevision.intValue())
    credito.fechaRevision = credito.fechaRevisionCxc

    // Se congela la fecha orignal de pago
    credito.fechaPago = getProximoPago(vto, cxc.cliente.credito.diaCobro.intValue())
    credito.reprogramarPago = credito.fechaPago
    // cxc.credito = credito
    // cxc.save failOnError: true, flush: true
    logEntity(credito)
    return credito
  }




  /**
    * Actualia los datos de revision y cobro de la cuenta por cobrar
    *
    * @param credito VentaCredito a actualizar
    * @return
    */
  public VentaCredito actualizarRevision(VentaCredito credito) {
    Date hoy = new Date()
    Integer diaRevision = credito.diaRevision
    Integer diaPago = credito.diaPago
    if(!credito.revisada) {
        credito.fechaRevision = getProximaRevision(hoy, diaRevision)
    }
    credito.reprogramarPago = getProximoPago(hoy, diaPago)
    if(credito.fechaRevision >= credito.reprogramarPago) {
        credito.reprogramarPago = getProximoPago(credito.vencimiento, diaPago)
    }
    // credito.save failOnError: true, flush: true
    logEntity(credito)
    return credito
  }

  def getProximaRevision(def fecha, Integer diaRevision){
    Integer dia = (fecha[Calendar.DAY_OF_WEEK] - 1)
    Integer dif = dia - diaRevision
    if (dif >= 0){
        def faltantes = 7 - dif
        def proximo = fecha + faltantes
        return proximo
    } else {
        def proximo = fecha + dif.abs()
        return proximo
    }
  }

  def getProximoPago(def fecha, int diaCobro){
    def dia = (fecha[Calendar.DAY_OF_WEEK] - 1)
    def dif = dia - diaCobro
    if(dif > 0 ) {
        def faltantes = 7 - dif
        def proxima = fecha + faltantes
        return proxima
    } else {
        def proxima = fecha + dif.abs()
        return proxima
    }
  }

}
