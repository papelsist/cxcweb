package sx.cxc

import javax.annotation.PostConstruct

import groovy.util.logging.Slf4j
import groovy.transform.TypeCheckingMode
import groovy.transform.CompileStatic

// import grails.compiler.GrailsCompileStatic
import org.springframework.scheduling.annotation.Scheduled


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
  @Scheduled(cron = "0 0 9-19 ? * MON-SAT")
  void syncFromAuditLog() {
    Date start = new Date()
    log.debug('Actualizando AntiguedadDeSaldos:{}', start)
    antiguedadService.generar()
    log.debug('Termino: {}', new Date())
  }
}
