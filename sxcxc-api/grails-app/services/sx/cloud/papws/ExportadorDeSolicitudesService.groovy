package sx.cloud.papws

import java.text.SimpleDateFormat

import groovy.util.logging.Slf4j

import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional

import com.google.api.core.ApiFuture
import com.google.cloud.firestore.*
import static com.google.cloud.firestore.DocumentChange.Type.*

import org.apache.commons.lang3.exception.ExceptionUtils

import sx.cloud.PapelsaCloudService
import sx.cxc.SolicitudDeDeposito


@Slf4j
// @GrailsCompileStatic
@Transactional
class ExportadorDeSolicitudesService {

  PapelsaCloudService papelsaCloudService

  private String COLLECTION = 'solicitudes'

  void pushSolicitud(SolicitudDeDeposito sol) {
    Map<String, Object> data = sol.toFirebase()
    ApiFuture<WriteResult> res = this.papelsaCloudService.getFirestore()
      .collection(this.COLLECTION)
      .document(sol.id)
      .set(data, SetOptions.merge())
    log.info('Published: {}' , res.get().updateTime)
  }



  List<SolicitudDeDeposito> fetchPendientes() {
    Date inicio = Date.parse('dd/MM/yyyy','20/03/2021')
    return SolicitudDeDeposito.where{fecha >= inicio && replicadoFirestore == null}.list([msx: 10])
  }

  int exportarPendientes() {
    List<SolicitudDeDeposito> pendientes = fetchPendientes()
    int count = 0;
    pendientes.each { sol ->
      try {
        exportarSolicitud(sol)
        count++;
      }catch (Exception ex) {
        String msg = ExceptionUtils.getRootCauseMessage(ex)
        log.error(msg, ex)
      }
    }
    return count
  }


  void exportarSolicitud(SolicitudDeDeposito sol) {
    this.pushSolicitud(sol)
    sol.replicadoFirestore = new Date()
    sol.save flush: true
  }

}
