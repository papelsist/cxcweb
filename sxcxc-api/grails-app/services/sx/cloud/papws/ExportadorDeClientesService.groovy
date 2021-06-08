package sx.cloud.papws

import groovy.json.JsonBuilder
import sx.core.Venta

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

  def exportarClientesToFirestorage() {
    List r1 = Venta
      .findAll('select distinct v.cliente from Venta v where v.fecha > :fecha',
        [fecha: Date.parse('dd/MM/yyyy','31/12/2018')])
    List r2 = Cliente.findAll(
      "from Cliente c where c.dateCreated > :fecha "
      , [fecha: Date.parse('dd/MM/yyyy','01/01/2019')])

    Set<Cliente> clientes = new HashSet<Cliente>()
    clientes.addAll(r1)
    clientes.addAll(r2)
    log.debug('All clientes: {}', clientes.size())
    byte[] data = buildJsonFile(clientes)
    Map<String,Object> metaData = [
      size: data.length
    ]
    String documentName="catalogos/ctes-all.json"
    this.papelsaCloudService.uploadDocument(documentName, data, 'application/json', metaData)

    // File file = new File("/Users/rubencancino/dumps/ctes-all.json")
    //file.text = jsonBuilder.toString()


  }

  String buildJsonFile(Set<Cliente> clientes) {
    JsonBuilder jsonBuilder = new JsonBuilder()
    jsonBuilder(clientes){ c->
      i c.id
      n c.nombre
      r c.rfc
      cf c.cfdiMail
      cv c.clave
      if(c.credito){
        cr true
      }
    }
    return jsonBuilder.toString()
  }

}
