package sx.cloud.papws

import javax.annotation.PostConstruct

import groovy.util.logging.Slf4j
import groovy.transform.TypeCheckingMode
import groovy.transform.CompileStatic

import org.springframework.scheduling.annotation.Scheduled

import sx.cloud.PapwsSolicitudesService

@Slf4j
@CompileStatic
class ExportadorDeProductosJobService  {


  static lazyInit = false

  ExportadorDeProductosService exportadorDeProductosService

  @PostConstruct
  def start() {
    log.debug('Inicializando exportador de productos ')
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
  void exportarSolicitudes() {
    // */5 9-18 * * 1-6
    Date start = new Date()
    log.info('Exportarando productos JSON file a Firestorage  at:{}', start)
    exportadorDeProductosService.exportarAsJsonFile()

  }
}
