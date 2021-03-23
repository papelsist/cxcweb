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
import sx.tesoreria.SolicitudDeDepositoService

import javax.annotation.Nullable
import javax.annotation.PostConstruct
import javax.annotation.PreDestroy

import static com.google.cloud.firestore.DocumentChange.Type.*

@Slf4j
// @CompileStatic
class PapwsSolicitudesService {

  static lazyInit = false

  PapelsaCloudService papelsaCloudService
  SolicitudDeDepositoService solicitudDeDepositoService

  private String COLLECTION = 'solicitudes'

  private ListenerRegistration registration

  List<QueryDocumentSnapshot> findAutorizadas() {
    return this.papelsaCloudService
      .getFirestore()
      .collection(this.COLLECTION)
      .whereEqualTo('autorizacion.replicado', null)
      .orderBy('dateCreated')
      .limit(10).get()
      .get().documents
  }

  void pushSolicitud(SolicitudDeDeposito sol) {
    Map<String, Object> data = sol.toFirebase()
    ApiFuture<WriteResult> res = this.papelsaCloudService.getFirestore()
      .collection(this.COLLECTION)
      .document(sol.id)
      .set(data, SetOptions.merge())
    log.info('Pudhed: {}' , res.get().updateTime)
  }

  @PostConstruct
  def start() {
    log.info('Registering listener to firebase collection: {}', COLLECTION)
    this.registration = this.papelsaCloudService
      .getFirestore()
      .collection(COLLECTION)
      .whereEqualTo('sucursal', 'OFICINAS')
      .whereEqualTo('autorizacion.replicado', null)
      .orderBy('dateCreated', Query.Direction.ASCENDING)
      .limit(25)
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
                actualizarSolicitud(it.document)
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
    log.info('Listening to firestore collection: {}', COLLECTION)
  }

  // @CompileStatic(TypeCheckingMode.SKIP)
  @Transactional
  void actualizarSolicitud(QueryDocumentSnapshot snapshot) {
    Map<String, Object> data = snapshot.data
    log.info('Actualizando solicitud autorizada: Folio: {} Id: {}', data.folio, data.id)

    SolicitudDeDeposito sol = SolicitudDeDeposito.get(data.id)

    if(sol) {
      Map<String, Object> auth = data.autorizacion

      log.info('Autorizacion: {}', auth)

      SolicitudAutorizacacion ax = new SolicitudAutorizacacion()
      ax.comentario = auth.comentario
      ax.createUser = auth.createUser
      ax.uid = auth.uid
      ax.fecha = auth.fecha = (auth.fecha as Timestamp).toDate()
      sol.auth = ax

      this.solicitudDeDepositoService.autorizar(sol)
      if(auth.replicado == null) {
        auth.replicado = new Date()
        this.papelsaCloudService
          .getFirestore()
          .collection(this.COLLECTION)
          .document(snapshot.id)
          .update([autorizacion: auth])
      }

    } else {
      log.info('No encontro la entidad: {}', data.get('id'))
    }
  }


  void onDelete(Map<String, Object> data) {
    log.info('Solicitud autorizada y replicada Folio:{} Id: {}', data.folio, data.id)
  }

  @PreDestroy
  def stop() {
    if(registration) {
      registration.remove()
      log.info('Firbase listener for collection: {} has been removed' , COLLECTION)
    }
  }

}