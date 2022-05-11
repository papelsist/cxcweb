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

import javax.sql.DataSource
import java.sql.SQLException
import groovy.sql.Sql
import sx.cloud.PapelsaCloudService
import sx.core.Producto
import sx.cloud.LxProducto

import sx.utils.Periodo


@Slf4j
// @GrailsCompileStatic
// @Transactional
class ExportadorDeExistenciasService {

  PapelsaCloudService papelsaCloudService

  DataSource dataSource


  @Transactional
  def actualizarExistencia(String id, Map data) {

    def docRef = papelsaCloudService
      .getFirestore()
      .document("productos/${id}")
	  def snapShot = docRef.get().get();

    if (snapShot.exists()) {
      def result = docRef.set([existencia: data], SetOptions.merge())
      //def result = docRef.([existencia: data])
      def updateTime = result.get()
        .getUpdateTime()
        .toDate()
        .format('dd/MM/yyyy')
      //log.debug('Existencia de {} / {} actualizada: {}', exis.clave, exis.sucursalNombre, updateTime)
      //log.debug("Prod ${id} exis updated at: ${updateTime}" )
    } else {
      def lxprod = new LxProducto(Producto.get(id)).toMap()
		  lxprod.existencia = data
		  def result = docRef.set(lxprod)
	    def updateTime = result.get()
        .getUpdateTime()
        .toDate()
        .format('dd/MM/yyyy')
      //log.debug(" ${lxprod.clave} registrado at: ${updateTime}" )
    }

  }

  @Transactional (readOnly = true)
  def exportarExistencias() {
    Map rows = fetchExistencias().groupBy{ it -> it.producto_id}
    rows.each { entry ->
      def id = entry.key
      def list = entry.value
      def data = [:]
      list.each { exis ->
        String nombre = exis.sucursal_nombre.replaceAll("\\s","").toLowerCase()
        log.debug('Sucursal: ', nombre)
         data[nombre] = [
          cantidad         : exis.cantidad as Long,
          recorte          : exis.recorte as Long,
          recorteComentario: exis.recorte_comentario,
          lastUpdated      : new Date()
        ]
      }
      actualizarExistencia(id, data)
      //log.debug('Existencia actualizando: %' , id)
    }
  }

  List fetchExistencias() {
    Integer ejercicio = Periodo.currentYear()
    Integer mes = Periodo.currentMes()
    log.debug('Existencias del ejercicio: {} mes: {}', ejercicio, mes)
    Sql sql = new Sql(this.dataSource)
    try {
        return sql.rows("""
        	select e.producto_id, e.clave, e.sucursal_id, e.sucursal_nombre, e.cantidad, e.recorte, e.recorte_comentario
			    from existencia e
			    join producto p on (e.producto_id = p.id)
          left join linea l on (p.linea_id = l.id)
          where e.anio = ?
            and e.mes = ?
            and l.linea not in('CONTABLE')
            order by l.linea
        """, [ejercicio, mes])
    } catch(Exception ex) {
        log.error('Error: ' + ex.message)
    } finally {
        sql.close()
    }
  }



}
