package sx.cloud

import com.google.api.core.ApiFuture
import com.google.cloud.firestore.DocumentReference
import com.google.cloud.firestore.FieldValue
import com.google.cloud.firestore.SetOptions
import com.google.cloud.firestore.WriteResult
import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional
import groovy.transform.TypeCheckingMode
import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils
import sx.core.LogUser
import sx.cxc.NotaDeCredito

@Slf4j
@Transactional
@GrailsCompileStatic
class LxAutorizacionService implements LogUser {

  FirebaseService firebaseService

  String collection = 'auth_bonificaciones'

  @Transactional()
  @GrailsCompileStatic(TypeCheckingMode.SKIP)
  NotaDeCredito solicitar(NotaDeCredito nota) {

    LxAutorizacionBonificacion auth = new LxAutorizacionBonificacion(nota)
    auth.solicitud = nota.solicitud
    auth.solicitudUser = nota.solicitudUser
    auth.setBonificacion(nota)
    String id = "${nota.serie}-${nota.folio}"
    log.debug('Pushing Solicitud de autorizacion {} a Firebase', id)

    Map<String, Object> changes = auth.toFirebaseMap()
    Date updateTime = this.pushToFirebase(id, changes)
    nota.solicitud = updateTime
    nota.solicitudUser = getCurrentUserName()
    nota.save flush: true
    return nota
  }

  Date pushToFirebase(String id, Map<String, Object> changes) {

    ApiFuture<WriteResult> result = firebaseService.getFirestore()
      .collection(collection)
      .document(id)
      .set(changes, SetOptions.merge())

    def updateTime = result.get().getUpdateTime().toDate()
    log.debug('Solicitud de autorizacion {} Posted at : {}', id, updateTime.format('dd/MM/yyyy'))
    return updateTime
  }

}



