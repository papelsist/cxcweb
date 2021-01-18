package sx.cloud

import groovy.util.logging.Slf4j
import groovy.transform.TypeCheckingMode

import grails.gorm.transactions.Transactional
import grails.compiler.GrailsCompileStatic

import grails.util.Environment

import com.google.cloud.firestore.*
import com.google.cloud.firestore.DocumentReference

import com.google.firebase.cloud.FirestoreClient
import com.google.api.core.ApiFuture
import com.google.api.core.ApiFutures



import org.apache.commons.lang3.exception.ExceptionUtils

import sx.core.Cliente
import sx.core.ComunicacionEmpresa
import sx.audit.Audit

@Slf4j
@GrailsCompileStatic
@Transactional
class LxClienteService {

  String collectionName = 'clientes'

  FirebaseService firebaseService

  def update(Cliente cliente) {
    this.push(cliente)
  }

  def push(Cliente cliente) {
    log.debug('Regsitrando cliente: {} en Firebase', cliente.nombre)
    LxCliente xp = new LxCliente(cliente)
    ApiFuture<WriteResult> result = getCollection()
        .document(xp.id)
        .set(xp.toFirebaseMap())
    def updateTime = result.get().getUpdateTime().toDate()
    log.debug("{} Published succesful at time : {} " , xp.nombre, updateTime)
    return updateTime
  }

  def update(Cliente c, Map<String, ? extends Object> changes) {
    log.debug('Actualizando FIREBASE cliente: {} changes: {}', c.clave, changes.keySet())
    DocumentReference docRef = fetchDocument(c.id)
    DocumentSnapshot snapShot = docRef.get().get()

    if (!snapShot.exists()) {
      log.debug('El cliente :{} NO EXISTE EN FIREBASE', c.id)
      return push(c)
    } else {
      ApiFuture<WriteResult> result  = docRef.update(changes)
      def updateTime = result.get().getUpdateTime().toDate()
      log.debug("Succescull FIREBASE update of {}  at: {} " , c.id, updateTime.format('dd/MM/yyyy: HH:mm'))
      return updateTime
    }
  }

  @GrailsCompileStatic(TypeCheckingMode.SKIP)
  def updateContacto(ComunicacionEmpresa contacto) {

    Cliente c = contacto.cliente
    DocumentReference docRef = fetchDocument(c.id)
    DocumentSnapshot snapShot = docRef.get().get()
    if (!snapShot.exists()) {
      log.debug('El cliente :{} NO EXISTE EN FIREBASE', contacto.id)
      push(contacto.cliente)
    } else {
      log.debug('Actualizando cliente: {} contactos: {}', c.clave, c.medios)
      List contactos = c.medios.collect{ item -> [
        id: item.id,
        activo: item.activo,
        tipo: item.tipo,
        descripcion: item.descripcion,
        comentario: item.comentario,
        cfdi: item.cfdi,
        validado: item.validado
      ]}


      ApiFuture<WriteResult> result  = docRef.update('medios', contactos)
      def updateTime = result.get().getUpdateTime().toDate()
      log.debug("{} Update succesful at: {} " , c.nombre, updateTime.format('dd/MM/yyyy: HH:mm'))
    }
  }

  DocumentReference fetchDocument(String id) {
    return getCollection().document(id)
  }

  CollectionReference getCollection() {
    return firebaseService.getFirestore().collection(collectionName)
  }

}
