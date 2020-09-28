package sx.cloud

import groovy.transform.TypeCheckingMode
import groovy.util.logging.Slf4j
import javax.sql.DataSource

import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional

import com.google.api.core.ApiFuture
import com.google.cloud.firestore.DocumentReference
import com.google.cloud.firestore.FieldValue
import com.google.cloud.firestore.SetOptions
import com.google.cloud.firestore.WriteResult

import org.apache.commons.lang3.exception.ExceptionUtils

import sx.core.LogUser
import sx.cxc.NotaDeCredito

@Slf4j
@Transactional
// @GrailsCompileStatic
class LxVentasPorLineaService implements LogUser {

  FirebaseService firebaseService

  DataSource dataSource

  String collection = 'ventas_linea'

  void updateData(Integer ejercicio, Integer mes) {
    Map params =  ['ejercicio': ejercicio, 'mes': mes]
    List data = fetchRows(buildQuery(), params)
    Map porLinea = data.groupBy{it.linea}
    porLinea.each { key, value ->
      // Map porSucursal = value.groupBy{ s -> s.sucursal}.collect{ r -> }
      // Map porTipo = value.groupBy { t -> t.origen}
    }

  }

  // List groupBySlice() {}

  // List<LxVentaPorLinea> mapRows(Map row) {}

  Date pushToFirebase(String id, Map<String, Object> changes) {

    ApiFuture<WriteResult> result = firebaseService.getFirestore()
      .collection(collection)
      .document(id)
      .set(changes, SetOptions.merge())

    def updateTime = result.get().getUpdateTime().toDate()
    log.debug('Solicitud de autorizacion {} Posted at : {}', id, updateTime.format('dd/MM/yyyy'))
    return updateTime
  }




  String buildQuery() {
    String s = """select
      linea,
      suc as sucursal,
      origen,
      sum(kilos) as kilos,
      sum(kilos/factoru) as cantidad,
      sum(imp_neto) as importe,
      SUM(COSTO_NETO / FACTORU) AS ccosto
      from FACT_VENTAS_DET V
      where
      year(V.FECHA) = :EJERCICIO and month(v.fecha) = :MES
      group by linea,suc, origen
      order by linea
    """
    return s
  }

}



