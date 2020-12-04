package sx.cloud

import com.google.cloud.Timestamp
import com.google.cloud.firestore.*

import grails.gorm.transactions.Transactional
import grails.web.databinding.DataBinder
import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils


import javax.annotation.Nullable
import javax.annotation.PostConstruct
import javax.annotation.PreDestroy

import static com.google.cloud.firestore.DocumentChange.Type.*

import sx.cxc.AnticipoSat
import sx.cxc.AnticipoSatDet

@Slf4j
// @GrailsCompileStatic
class LxAnticipoListenerService implements DataBinder, EventListener<QuerySnapshot> {

  static lazyInit = false

  FirebaseService firebaseService

  String collection = 'anticipos'

  ListenerRegistration registration

  private Date inicio

  @PostConstruct
  def start() {
    Firestore db = firebaseService.getFirestore()
    registration = db.collection(collection)
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
      log.debug('Anticipo: {} change: {}  ',dc.document.getId(), dc.getType() )
      QueryDocumentSnapshot document = dc.document
      switch (dc.type) {
        case ADDED:
        case MODIFIED:
          updateAnticipo(document.data, document.getId())
          break
        case REMOVED:
          onRemoved(document.data)
          break
      }
    }
  }

  @Transactional()
  void updateAnticipo(Map<String, Object> value, String folio) {
    Map data = value.findAll{it.key != 'aplicaciones'}
    AnticipoSat ant = AnticipoSat.get(data.id)
    if(!ant){
      log.debug('Registrando nuevo anticipo: {}', folio)
      ant = new AnticipoSat()
      ant.id = data.id
    } else {
      log.debug('Actualizando anticipo: {}', folio)
      ant.aplicaciones.clear()
      ant.save flush: true
    }
    ant.properties = data

    List aplicaciones = value.aplicaciones.collect{
      def det = new AnticipoSatDet(it)
      det.id = it.id
      return det
    }
    aplicaciones.each{
      ant.addToAplicaciones(it)
    }
    def valid = ant.validate()
    if(valid) {
      ant = ant.save flush: true
      log.debug('Anticipo salvado: {}', ant.id)
    } else {
      log.error('Anticipo invalido errors: {}', ant.errors)
    }
  }

  @Transactional()
  void onRemoved(Map<String, Object> data) {
    AnticipoSat ant = AnticipoSat.get(data.id)
    if(ant) {
      ant.delete flush: true
    }
  }

}


