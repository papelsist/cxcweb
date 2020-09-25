package sx.bi


import groovy.util.logging.Slf4j
import groovy.transform.ToString
import groovy.transform.TypeCheckingMode


import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional
import grails.gorm.transactions.NotTransactional

import grails.plugin.springsecurity.annotation.Secured
import static org.springframework.http.HttpStatus.*

import org.apache.commons.lang3.exception.ExceptionUtils

import sx.reports.ReportService
import sx.cloud.MailJetService
import sx.cfdi.CfdiPrintService

import sx.utils.Periodo

// @GrailsCompileStatic
@Transactional(readOnly = true)
@Secured("hasAnyRole('ROLE_ADMIN', 'ROLE_BI')")
@Slf4j
class AnalyticsController  {

  ReportService reportService

  MailJetService mailJetService

  CfdiPrintService cfdiPrintService

  AnalisisDeVentaService analisisDeVentaService

  def ventaMensual(VentaMensualCommand command) {
    if(command == null) {
      log.debug('VentaCommand not provided')
      render status: NOT_FOUND
      return
    }
    List data = this.analisisDeVentaService.ventaNetaMensual(command)
    respond data
  }

  // @GrailsCompileStatic(TypeCheckingMode.SKIP)
  def bajaEnVentas() {
    log.info('Params: {} ', params)
    Periodo periodo = (Periodo)params.periodo
    log.info('Periodo: {}', periodo)
    Map repParams = ['FECHA_INI': periodo.fechaInicial, 'FECHA_FIN': periodo.fechaFinal]
    repParams.FORMA = params.forma
    repParams.ORDER = params.orden as Integer
    repParams.DIAS = params.dias  as Integer
    repParams.VALOR_VENTA = params.valorVenta as BigDecimal
    repParams.ORIGEN = params.origen
    repParams.PORCENTAJE = params.porcentaje as Double
    repParams.SUCURSAL = params.sucursal
    def pdf =  reportService.run('bi/BajaEnVentas.jrxml', repParams)
    render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'BajaEnVentas.pdf')
  }

  def mejoresClientes() {
    log.info('Params: {} ', params)
    Periodo periodo = (Periodo)params.periodo
    Map repParams = ['FECHA_INI': periodo.fechaInicial, 'FECHA_FIN': periodo.fechaFinal]
    repParams.ORIGEN = params.origen
    repParams.NO_CLIENTES = params.numeroDeClientes  as Integer

    def pdf =  reportService.run('bi/MejoresClientes.jrxml', repParams)
    render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'MejoresClientess.pdf')
  }

  def ventasClientesResumen() {
    log.info('Params: {} ', params)
    Periodo periodo = (Periodo)params.periodo
    Map repParams = ['FECHA_INI': periodo.fechaInicial, 'FECHA_FIN': periodo.fechaFinal]
    repParams.ORIGEN = params.origen
    repParams.CLIENTE = params.cliente

    def pdf =  reportService.run('bi/VentasClienteResumen.jrxml', repParams)
    render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'VentasClienteResumen.pdf')
  }

  def clienteSinVentas() {
    log.info('Params: {} ', params)
    Periodo periodo = (Periodo)params.periodo
    Map repParams = ['FECHA_INI': periodo.fechaInicial, 'FECHA_FIN': periodo.fechaFinal]
    repParams.FORMA = params.forma
    repParams.ORDER = params.orden as Integer
    repParams.DIAS = params.dias  as Integer
    repParams.VALOR_VENTA = params.valorVenta as BigDecimal
    repParams.ORIGEN = params.origen
    repParams.SUCURSAL = params.sucursal
    def pdf =  reportService.run('bi/ClienteSinVenta.jrxml', repParams)
    render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'ClientesSinVenta.pdf')
  }

  def comparativoMejoresClientes() {
    log.info('Params: {} ', params)
    Map repParams = [:]
    repParams.MES_INI = params.mesInicial as Integer
    repParams.MES_FIN = params.mesFinal as Integer
    repParams.YEAR1 = params.ejercicioInicial  as Integer
    repParams.YEAR2 = params.ejercicioFinal as Integer
    repParams.ORIGEN = params.origen
    repParams.SUCURSAL = params.sucursal
    repParams.NO_CLIENTES = params.numeroDeClientes as Integer
    Boolean kilos = params.getBoolean('kilos')
    String rep = kilos ? 'MejoresClientesEnKilosComp.jrxml' : 'MejoresClientesEnPesosComp.jrxml'
    def pdf =  reportService.run("bi/${rep}", repParams)
    render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'ClientesSinVenta.pdf')
  }

  def ventasPorLineaCliente() {
    log.info('Params: {} ', params)
    Map repParams = [:]
    repParams.MES_INI = params.mesInicial as Integer
    repParams.MES_FIN = params.mesFinal as Integer
    repParams.YEAR1 = params.ejercicioInicial  as Integer
    repParams.YEAR2 = params.ejercicioFinal as Integer
    repParams.ORIGEN = params.origen
    repParams.CLIENTE_ID = params.cliente

    Boolean kilos = params.getBoolean('kilos')
    String rep = kilos ? 'VentasXLineaXCteEnKilosComp.jrxml' : 'VentasXLineaXCteEnPesosComp.jrxml'
    def pdf =  reportService.run("bi/${rep}", repParams)
    render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'ClientesSinVenta.pdf')
  }

  def handleException(Exception e) {
    String message = ExceptionUtils.getRootCauseMessage(e)
    log.error(message, e)
    respond([message: message], status: 500)
  }

}


@ToString(includeNames = true)
public class VentaMensualCommand {
  Integer ejercicio
  Integer mes
  String slice
  String tipoDeVenta;
  String tipoDeProducto;

  static constraints = {}
}



