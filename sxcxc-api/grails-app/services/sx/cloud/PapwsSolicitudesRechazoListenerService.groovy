package sx.cloud


import com.google.api.core.ApiFuture
import com.google.cloud.Timestamp
import com.google.cloud.firestore.*
import grails.gorm.transactions.Transactional
import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils
import sx.cloud.PapelsaCloudService
import sx.cxc.SolicitudAutorizacacion
import sx.cxc.SolicitudDeDeposito
import sx.cxc.SolicitudRechazo
import sx.tesoreria.SolicitudDeDepositoService

import javax.annotation.Nullable
import javax.annotation.PostConstruct
import javax.annotation.PreDestroy

import static com.google.cloud.firestore.DocumentChange.Type.*

@Slf4j
// @CompileStatic
class PapwsSolicitudesRechazoListenerService {

  static lazyInit = false

  PapelsaCloudService papelsaCloudService
  SolicitudDeDepositoService solicitudDeDepositoService

  private String COLLECTION = 'solicitudes'

  private ListenerRegistration registration

  @PostConstruct
  def start() {
    this.registration = this.papelsaCloudService
      .getFirestore()
      .collection(COLLECTION)
      .whereEqualTo('sucursal', 'OFICINAS')
      // .whereEqualTo('status', 'RECHAZADO')
      .whereEqualTo('rechazo.replicado', null)
      .orderBy('dateCreated', Query.Direction.ASCENDING)
      .limit(20)
      .addSnapshotListener(new EventListener<QuerySnapshot>() {
        @Override
        void onEvent(@Nullable QuerySnapshot snapshots, @Nullable FirestoreException error) {
          if(error) {
            String msg = ExceptionUtils.getRootCauseMessage(error)
            log.error("Error: {}", msg, error)
            return
          }
          snapshots.getDocumentChanges().each {
            Integer folio = it.document.get('folio') as Integer
            log.info('Solicitud changed: {} Type: {}', folio, it.type)
            switch (it.type) {
              case ADDED:
              case MODIFIED:
                try{
                  actualizarRechazo(it.document)
                } catch (Exception ex) {
                  log.error('Error actualizando solicitud {} from Firebase', folio)
                  log.error(ExceptionUtils.getRootCauseMessage(ex), ex)
                }
                break
              case REMOVED:
                onDelete(it.document.data)
                break
            }
          }
        }
      })
    log.info('Firebase Listenere started: Solicitudes rechazadas')
  }

  // @CompileStatic(TypeCheckingMode.SKIP)
  @Transactional
  void actualizarRechazo(QueryDocumentSnapshot snapshot) {
    Map data = snapshot.data
    Map rechazo = data.rechazo
    rechazo.dateCreated = (rechazo.dateCreated as Timestamp).toDate()
    log.info('Registrando rechazo: {}', rechazo)

    SolicitudDeDeposito sol = SolicitudDeDeposito.get(data.id)
    sol.rechazo = new SolicitudRechazo([
      motivo: rechazo.motivo,
      comentario: rechazo.comentario,
      createUser: rechazo.userName,
      dateCreated: rechazo.dateCreated,
      uid: rechazo.uid
    ])
    sol = sol.save flush: true

    rechazo.replicado = new Date()
    this.papelsaCloudService
      .getFirestore()
      .collection(this.COLLECTION)
      .document(snapshot.id)
      .update([rechazo: rechazo])
    log.info('Rechazo registrado')
  }


  void onDelete(Map<String, Object> data) {
    log.info('Solicitud rechazada actualizada Folio:{} Id: {}', data.folio, data.id)
  }

  @PreDestroy
  def stop() {
    if(registration) {
      registration.remove()
      log.info('Fiebase Listener terminated: Solicitudes rechazadas')
    }
  }

}

