package sx.bi


import groovy.util.logging.Slf4j
import groovy.transform.ToString

import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional
import grails.gorm.transactions.NotTransactional

import grails.plugin.springsecurity.annotation.Secured
import static org.springframework.http.HttpStatus.*

import org.apache.commons.lang3.exception.ExceptionUtils

import sx.reports.ReportService
import sx.cloud.MailJetService
import sx.cfdi.CfdiPrintService

// @GrailsCompileStatic
@Transactional(readOnly = true)
@Secured("hasAnyRole('ROLE_ADMIN', 'ROLE_BI')")
@Slf4j
class AnalyticsController  {

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



