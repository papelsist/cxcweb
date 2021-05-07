package sx.cxc

import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils
import org.springframework.scheduling.annotation.Scheduled

import javax.annotation.PostConstruct

// import grails.compiler.GrailsCompileStatic

@Slf4j
@CompileStatic
class AntiguedadDeSaldosJobService  {

  static lazyInit = false

  AntiguedadService antiguedadService

  @PostConstruct
  def start() {
    log.debug('Inicializando AntiguedadJobService')
  }

  // @Scheduled(fixedDelay = 10000L)
  /**
    * cronExpression: "s m h D M W Y"
    *                  | | | | | | `- Year [optional]
    *                  | | | | | `- Day of Week, 1-7 or SUN-SAT, ?
    *                  | | | | `- Month, 1-12 or JAN-DEC
    *                  | | | `- Day of Month, 1-31, ?
    *                  | | `- Hour, 0-23
    *                  | `- Minute, 0-59
    *                  `- Second, 0-59
    */
  @Scheduled(cron = "0 0 7-19 ? * MON-SAT")
  void syncFromAuditLog() {
    Date start = new Date()
    log.debug('Actualizando AntiguedadDeSaldos:{}', start)
    antiguedadService.generar()
    try {
      antiguedadService.uploadReport(start)
    }catch (Exception ex) {
      String msg = ExceptionUtils.getRootCauseMessage(ex)
      log.error('Error generando/subiendo reporte de antiguedad: ' + msg, ex)
    }
    log.debug('Termino: {}', new Date())
  }
}
