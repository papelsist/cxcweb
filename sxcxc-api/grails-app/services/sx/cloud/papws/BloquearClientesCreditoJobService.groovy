package sx.cloud.papws

import javax.annotation.PostConstruct

import groovy.util.logging.Slf4j
import groovy.transform.TypeCheckingMode
import groovy.transform.CompileStatic

import org.springframework.scheduling.annotation.Scheduled

import sx.cloud.PapwsSolicitudesService

@Slf4j
@CompileStatic
class BloquearClientesCreditoJobService  {

  static lazyInit = false

  PapwsClienteService papwsClienteService

  @PostConstruct
  def start() {
    log.debug('Inicializando exportador de productos ')
  }


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
  @Scheduled(cron = "0 0 8,19 ? * MON-SAT")
  void exportarSolicitudes() {
    Date start = new Date()
    log.info('Bloqueando todos los clientes de credito  at:{}', start)
    papwsClienteService.bloquearClientesCredito()
  }
}
