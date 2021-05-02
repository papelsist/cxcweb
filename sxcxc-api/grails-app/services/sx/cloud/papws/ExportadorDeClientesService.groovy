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
import sx.core.Cliente
import sx.cloud.*


@Slf4j
// @GrailsCompileStatic
// @Transactional
class ExportadorDeClientesService {

  PapelsaCloudService papelsaCloudService

  Date pushToFirestore(Cliente cliente) {
    log.debug('Regsitrando cliente: {} en Firebase', cliente.nombre)
    LxCliente xp = new LxCliente(cliente)
    ApiFuture<WriteResult> result = papelsaCloudService
      .getFirestore()
      .collection('clientes')
      .document(xp.id)
      .set(xp.toFirebaseMap())
    def updateTime = result.get().getUpdateTime().toDate()
    log.debug("{} Published succesful at time : {} " , xp.nombre, updateTime)
    return updateTime
  }


}
