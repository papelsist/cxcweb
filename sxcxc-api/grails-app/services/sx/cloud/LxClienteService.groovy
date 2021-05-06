package sx.cloud

import com.google.api.core.ApiFuture
import com.google.cloud.firestore.CollectionReference
import com.google.cloud.firestore.DocumentReference
import com.google.cloud.firestore.DocumentSnapshot
import com.google.cloud.firestore.WriteResult
import grails.gorm.transactions.Transactional
import groovy.util.logging.Slf4j
import sx.cloud.papws.PapwsClienteService
import sx.core.Cliente

@Slf4j
@Transactional
class LxClienteService {

  String collectionName = 'clientes'

  FirebaseService firebaseService
  PapwsClienteService papwsClienteService

  def update(Cliente cliente) {
    this.push(cliente)
    this.papwsClienteService.push(cliente)
  }

  def push(Cliente cliente) {
    LxCliente xp = new LxCliente(cliente)
    ApiFuture<WriteResult> result = getCollection()
        .document(xp.id)
        .set(xp.toFirebaseMap())
    def updateTime = result.get().getUpdateTime().toDate()
    log.debug("... OldCloud {} updated at: {} " , xp.nombre, updateTime)
    return updateTime
  }

  def update(Cliente c, Map<String, ? extends Object> changes) {
    DocumentReference docRef = fetchDocument(c.id)
    DocumentSnapshot snapShot = docRef.get().get()
    if (!snapShot.exists()) {
      log.debug('...OldCloud El cliente :{} NO EXISTE EN FIREBASE', c.id)
      return push(c)
    } else {
      ApiFuture<WriteResult> result  = docRef.update(changes)
      def updateTime = result.get().getUpdateTime().toDate()
      log.debug("...OldCloud Cliente ID: {} Updated at: {} " , c.id, updateTime.format('dd/MM/yyyy: HH:mm'))
      return this.papwsClienteService.update(c, changes)
    }
  }

  void updateCriticalProperties(String clienteId, Map<String,Object> changes){
    /*
    log.debug('OldCloud ...Critical changes of cliente: {}', clienteId)
    log.debug('OldCloud ...Changes: {}', changes)
    ApiFuture<DocumentReference> result = this.firebaseService
      .getFirestore()
      .document("clientes_critical_log/${clienteId}")
      .collection('changes')
      .add(changes)
    def docRef = result.get()
    log.info("OldCloud ...Critical changes registered doc: {}" , docRef.getId())
     */
    this.papwsClienteService.updateCriticalProperties(clienteId, changes)
  }

  DocumentReference fetchDocument(String id) {
    return getCollection().document(id)
  }

  CollectionReference getCollection() {
    return firebaseService.getFirestore().collection(collectionName)
  }

}
