package sx.cloud

import javax.annotation.PostConstruct

import groovy.util.logging.Slf4j
import groovy.transform.TypeCheckingMode
import groovy.transform.CompileStatic

import org.springframework.scheduling.annotation.Scheduled

import sx.cloud.PapwsSolicitudesService

@Slf4j
@CompileStatic
class ExportadorDeProductoJobService  {


  static lazyInit = false

  PapwsCallcenterMigrationService papwsCallcenterMigrationService

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
    //Este correria a la media de cada 2 horas de 9 a 7 de lunes a sabado
  @Scheduled(cron = "0 30 6-20/3 ? * MON-SAT")
  //@Scheduled(cron = "0 0/1 9-19 ? * MON-SAT")
  void exportarElProducto() {
    // */5 9-18 * * 1-6
    Date start = new Date()
    log.info('Exportando productos la prueba funciono at:{}', start)
    papwsCallcenterMigrationService.exportarProductos()

  }
}
