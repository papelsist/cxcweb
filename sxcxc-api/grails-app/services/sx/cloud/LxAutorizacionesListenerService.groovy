package sx.cloud

import com.google.cloud.Timestamp
import com.google.cloud.firestore.*
import grails.gorm.transactions.Transactional
import grails.web.databinding.DataBinder
import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils
import sx.cxc.NotaDeCredito

import javax.annotation.Nullable
import javax.annotation.PostConstruct
import javax.annotation.PreDestroy

import static com.google.cloud.firestore.DocumentChange.Type.*

@Slf4j
// @GrailsCompileStatic
class LxAutorizacionesListenerService implements DataBinder, EventListener<QuerySnapshot> {

  static lazyInit = false

  FirebaseService firebaseService

  String collection = 'auth_bonificaciones'

  ListenerRegistration registration

  private Date inicio

  @PostConstruct
  def start() {
    Firestore db = firebaseService.getFirestore()
    registration = db.collection(collection)
      .whereGreaterThanOrEqualTo('fecha', getInicio())
      .orderBy('fecha', Query.Direction.ASCENDING)
      .addSnapshotListener(this)
    log.info('Listening to firestore collection: {}', collection)
  }

  @PreDestroy
  def stop() {
    if (registration) {
      registration.remove()
      log.info('Firbase listener for collection: {} removed', collection)
    }
  }

  void onEvent(@Nullable QuerySnapshot snapshots, @Nullable FirestoreException ex) {

    if (ex) {
      String msg = ExceptionUtils.getRootCauseMessage(ex)
      log.error("Error: {}", msg, ex)
    }

    snapshots.documentChanges.each { DocumentChange dc ->
      log.debug('Change detected Type: {} Doc: {} ', dc.getType(), dc.document.getId())
      QueryDocumentSnapshot document = dc.document
      switch (dc.type) {
        case ADDED:
          onAdded(document.data)
          break
        case MODIFIED:
          onModified(document.data)
          break
        case REMOVED:
          onRemoved(document.data)
          break
      }
    }
  }

  @Transactional()
  void onAdded(Map<String, Object> data) {}

  @Transactional()
  void onModified(Map<String, Object> data) {
    NotaDeCredito nota = resolve(data)

    if (data.autorizacion) {
      try {
        Map<String, Object> auth = data.autorizacion
        Timestamp tfecha = data.fecha
        Autorizacion autorizacion = new Autorizacion()
        autorizacion.fecha = tfecha.toDate()
        autorizacion.comentario = auth.comentario
        autorizacion.usuario = auth.usuario

        nota.autorizacion = autorizacion
        nota.save failOnError: true, flush: true
        log.info('Bonificacion {} autorizada', nota.id)
      }catch( Exception ex) {
        ex.printStackTrace()
        Throwable origen = ExceptionUtils.getRootCause(ex)
        String message = ExceptionUtils.getRootCauseMessage(ex)
        log.error(message, origen)
      }

    }
  }

  @Transactional()
  void onRemoved(Map<String, Object> data) {}

  // @GrailsCompileStatic(TypeCheckingMode.SKIP)
  NotaDeCredito resolve(Map<String, Object> data) {
    String id = (String) data.bonificacion['id']
    return NotaDeCredito.get(id)
  }

  Date getInicio() {
    if (this.inicio == null) {
      this.inicio = (new Date() - 10);
    }
    return inicio
  }

  void setInicio(Date value) {
    this.inicio = value
  }
}


