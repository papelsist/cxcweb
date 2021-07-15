package sx.cloud.papws

import com.google.api.core.ApiFuture
import com.google.cloud.firestore.CollectionReference
import com.google.cloud.firestore.DocumentReference
import com.google.cloud.firestore.DocumentSnapshot
import com.google.cloud.firestore.WriteResult
import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional
import groovy.util.logging.Slf4j
import sx.cloud.FirebaseService
import sx.cloud.LxCliente
import sx.cloud.PapelsaCloudService
import sx.core.Cliente
import sx.core.ClienteCredito

@Slf4j
@Transactional
class PapwsClienteService {

  String collectionName = 'clientes'

  PapelsaCloudService papelsaCloudService

  def update(Cliente cliente) {
    this.push(cliente)
  }

  def push(Cliente cliente) {
    log.info('Regsitrando cliente: {} en PAPWS Firestore', cliente.nombre)
    LxCliente xp = new LxCliente(cliente)
    ApiFuture<WriteResult> result = getCollection()
      .document(xp.id)
      .set(xp.toFirebaseMap())
    def updateTime = result.get().getUpdateTime().toDate()
    log.debug("{} Actualizado succesful at time : {} " , xp.nombre, updateTime)
    return updateTime
  }

  def update(Cliente c, Map<String, ? extends Object> changes) {
    log.info('Actualizando PAPWS Firestore cliente: {} changes: {}', c.clave, changes.keySet())
    DocumentReference docRef = fetchDocument(c.id)
    DocumentSnapshot snapShot = docRef.get().get()

    if (!snapShot.exists()) {
      log.debug('El cliente :{} NO EXISTE EN FIREBASE', c.id)
      return push(c)
    } else {
      ApiFuture<WriteResult> result  = docRef.update(changes)
      def updateTime = result.get().getUpdateTime().toDate()
      log.debug("{} actualizado en firestore actualizado {}  at: {} " , c.id, updateTime.format('dd/MM/yyyy: HH:mm'))
      return updateTime
    }
  }

  void updateCriticalProperties(String clienteId, Map changes){
    log.debug('Critical changes of cliente: {}', clienteId)
    log.debug('Changes: {}', changes)
    ApiFuture<DocumentReference> result = this.papelsaCloudService
      .getFirestore()
      .collection('clientes_log')
      .add(changes)
    def docRef = result.get()
    log.info("Critical changes registered doc: {}" , docRef.getId())
  }

  DocumentReference fetchDocument(String id) {
    return getCollection().document(id)
  }

  CollectionReference getCollection() {
    return papelsaCloudService.getFirestore().collection(collectionName)
  }

  @Transactional(readOnly = true)
  def bloquearClientesCredito() {
    ClienteCredito.list().each { cr ->

      Cliente cliente = cr.cliente
      DocumentReference docRef = fetchDocument(cliente.id)
      DocumentSnapshot snapShot = docRef.get().get()

      if (!snapShot.exists()) {
        log.debug('El cliente :{} NO EXISTE EN FIREBASE', cliente.id)
        cliente.credito.creditoActivo = false
        return push(cliente)
      } else {
        Map changes = [credito: [creditoActivo: false]]
        ApiFuture<WriteResult> result  = docRef.update(changes)
        def updateTime = result.get().getUpdateTime().toDate()
        log.debug("{} actualizado en firestore actualizado {}  at: {} " , cliente.id, updateTime.format('dd/MM/yyyy: HH:mm'))
        return updateTime
      }
    }
  }
}
