package sx.cloud.papws

import groovy.json.JsonBuilder
import sx.core.Venta

import java.text.SimpleDateFormat

import groovy.util.logging.Slf4j

import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional

import com.google.api.core.ApiFuture
import com.google.cloud.firestore.*
import com.google.cloud.firestore.SetOptions
import static com.google.cloud.firestore.DocumentChange.Type.*

import org.apache.commons.lang3.exception.ExceptionUtils

import sx.cloud.PapelsaCloudService
import sx.core.Producto
import sx.cloud.LxProducto


@Slf4j
// @GrailsCompileStatic
// @Transactional
class ExportadorDeProductosService {

  PapelsaCloudService papelsaCloudService

  @Transactional
  Date pushToFirestore(Producto producto) {
    log.debug('Pushing producto: {} en Firebase', producto.clave)
    LxProducto xp = new LxProducto(producto)
    ApiFuture<WriteResult> result = papelsaCloudService
      .getFirestore()
      .collection('productos')
      .document(xp.id)
      .set(xp.toMap(), SetOptions.merge())
    def updateTime = result.get().getUpdateTime().toDate()
    log.debug("Producto {} saved in firestore succesful at time : {} " , xp.clave, updateTime)
    return updateTime
  }

  @Transactional(readOnly = true)
  def exportarToFirestore() {
    Producto.list().each { p ->
      pushToFirestore(p)
    }
  }

  @Transactional(readOnly = true)
  def exportarAsJsonFile() {

    List<Producto> productos = Producto.where{activo==true}.list()
    log.debug('All productos: {}', productos.size())
    byte[] data = buildJsonFile(productos)
    Map<String,Object> metaData = [
      size: data.length
    ]
    String documentName="catalogos/productos-all.json"
    this.papelsaCloudService.uploadDocument(documentName, data, 'application/json', metaData)
  }

  String buildJsonFile(List<Producto> productos) {
    JsonBuilder jsonBuilder = new JsonBuilder()
    jsonBuilder(productos) { Producto p ->
    	id p.id
      clave p.clave
      descripcion p.descripcion
      unidad p.unidad
      linea p.linea ? p.linea.linea : 'NO_DEFINIDA'
      marca p.marca ? p.marca.marca : 'NO_DEFINIDA'
      clase p.clase ? p.clase.clase : 'NO_DEFINIDA'
      kilos p.kilos
      gramos p.gramos
      presentacion p.presentacion
      precioCredito p.precioCredito
      precioContado p.precioContado
	  }

    return jsonBuilder.toString()
  }

}
