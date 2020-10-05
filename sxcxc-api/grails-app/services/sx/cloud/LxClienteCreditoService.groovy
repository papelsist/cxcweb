package sx.cloud

import com.google.api.core.ApiFuture
import com.google.cloud.firestore.CollectionReference
import com.google.cloud.firestore.WriteResult
import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional
import groovy.transform.TypeCheckingMode
import groovy.util.logging.Slf4j
import sx.audit.Audit
import sx.core.ClienteCredito

@Slf4j
@GrailsCompileStatic
@Transactional
class LxClienteCreditoService {

  String collectionName = 'clientes'

  FirebaseService firebaseService

  def update(ClienteCredito credito) {
    // Temporalmente
    this.push(credito)
  }

  def push(ClienteCredito credito) {

    LxCliente xp = new LxCliente(credito.cliente)
    ApiFuture<WriteResult> result = getCollection()
      .document(xp.id)
      .set(xp.toFirebaseMap())
    def updateTime = result.get().getUpdateTime().toDate()
    log.debug("{} Published succesful at time : {} ", xp.nombre, updateTime)
    // logAudit(xp.id, "UPDATE", "${xp.clave} UPDATED IN FIREBASE", 1, updateTime)
    return updateTime
  }

  CollectionReference getCollection() {
    return firebaseService.getFirestore().collection(collectionName)
  }


  // @GrailsCompileStatic(TypeCheckingMode.SKIP)
  // Audit logAudit(String id, String event, String message, int registros, Date updateTime = null) {
  //   Audit.withNewSession {
  //     Audit alog = new Audit(
  //       name: 'LxClienteCredito',
  //       persistedObjectId: id,
  //       source: 'OFICINAS',
  //       target: 'FIREBASE',
  //       tableName: 'ClienteCredito',
  //       eventName: event,
  //       message: message,
  //       dateReplicated: updateTime
  //     )
  //     alog.save failOnError: true, flush: true
  //   }
  // }


}
