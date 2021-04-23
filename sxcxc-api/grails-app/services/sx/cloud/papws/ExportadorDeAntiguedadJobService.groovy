package sx.cloud.papws

import javax.annotation.PostConstruct

import groovy.util.logging.Slf4j
import groovy.transform.TypeCheckingMode
import groovy.transform.CompileStatic

// import grails.compiler.GrailsCompileStatic
import org.springframework.scheduling.annotation.Scheduled


@Slf4j
@CompileStatic
class ExportadorDeAntiguedadJobService  {

  static lazyInit = false
  @PostConstruct
  def start() {
    log.debug('Inicializando Exportador de antiguedad de saldos...')
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
  @Scheduled(cron = "0 0 19 ? * MON-SAT")
  void run() {
    Date start = new Date()
    log.debug('Exportando antiguedad de saldos:{}', start)
    log.debug('Termino: {}', new Date())
  }
}
