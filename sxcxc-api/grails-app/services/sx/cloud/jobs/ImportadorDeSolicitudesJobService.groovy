package sx.cloud.jobs

import javax.annotation.PostConstruct

import groovy.util.logging.Slf4j
import groovy.transform.TypeCheckingMode
import groovy.transform.CompileStatic

import org.springframework.scheduling.annotation.Scheduled

@Slf4j
@CompileStatic
class ImportadorDeSolicitudesJobService  {

  static lazyInit = false

  @PostConstruct
  def start() {
    log.debug('Inicializando ImportadorDeSolicitudes')
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
  @Scheduled(cron = "0 */5 9-22 ? * MON-SAT")
  void syncFromAuditLog() {
    // */5 9-18 * * 1-6
    Date start = new Date()
    log.info('Importando solicitudes start at:{}', start)
  }
}
