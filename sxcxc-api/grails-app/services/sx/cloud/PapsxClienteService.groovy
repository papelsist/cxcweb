package sx.cloud

import com.google.api.core.ApiFuture
import com.google.cloud.firestore.CollectionReference
import com.google.cloud.firestore.DocumentReference
import com.google.cloud.firestore.SetOptions
import com.google.cloud.firestore.WriteBatch
import com.google.cloud.firestore.WriteResult
import grails.compiler.GrailsCompileStatic
import groovy.util.logging.Slf4j
import sx.core.Cliente
import sx.core.ClienteCredito
import sx.core.Existencia
import sx.core.Producto
import sx.security.User
import sx.utils.Periodo

@Slf4j
// @GrailsCompileStatic
class PapsxClienteService {

  PapelsaCloudService papelsaCloudService

  List<Cliente> fetchClientes(int max = 300) {
    Date inicio = Date.parse('dd/MM/yyyy','01/01/2020')
    List<Cliente> clientes = Cliente.findAll(
      'select distinct(v.cliente) from Venta v where v.fecha>=:start  order by v.fecha desc',
      [start: inicio], [max: max])
    clientes.addAll(ClienteCredito.findAll("select c.cliente from ClienteCredito c"))
    return clientes
  }

  void exportarClientes(int max = 300) {
    List<Cliente> clientes = fetchClientes(max)
    List<Map> rows = clientes.collect{new LxCliente(it).toFirebaseMap()}
    pushInBatch(rows, 'clientes', 'id')
  }

  List<Producto> fetchProductos(int max = 5000) {
    return Producto.findAll(
      'from Producto p where p.inventariable=true order by p.linea.linea asc', [max: max])
  }

  void exportarProductos(int max = 5000) {
    List<Producto> productos = fetchProductos(max)
    List<Map> rows = productos.collect({new LxProducto(it).toMap()})
    rows.each {
      Map existencia = fetchExistencia(it.id)
      it['existencia'] = existencia
      it.disponible = existencia.values().sum(0.0, {it.cantidad}).toDouble()
    }
    log.info('Productos to firebase: {}', rows)
    pushInBatch(rows, 'productos', 'id')
  }

  void exportarUsuarios() {
    List<User> usuarios = User.findAll()
    CollectionReference colRef = papelsaCloudService.getFirestore().collection('usuarios')
    WriteBatch batch = papelsaCloudService.getFirestore().batch()

    usuarios.each {
      log.info('Agregando usuario: {}',it.nombre)
      Map<String, Object> data = [email: null,
        displayName: it.nombres + ' ' + it.apellidoPaterno,
        nombre: it.nombre,
        numeroDeEmpleado: it.numeroDeEmpleado,
        sucursal: it.sucursal,
        puesto: it.puesto,
        uid: it.username,
        username: it.username
      ]
      DocumentReference docRef = colRef.document(it.username)
      batch.set(docRef, data, SetOptions.merge())
    }
    ApiFuture<List<WriteResult>> future = batch.commit()
    log.info('Usuarios exportados {}', future.get().size())
  }

  Map fetchExistencia(String productoId) {
    Date start = new Date()
    Long ejercicio = Periodo.obtenerYear(new Date()).toLong()
    Long mes = (Periodo.obtenerMes(new Date()) + 1).toLong()
    List<Map> rows = Existencia.findAll(
      """select e.cantidad, e.sucursal.nombre from Existencia e
      where e.producto.id=:id and e.anio=:ejercicio and e.mes=:mes
      order by e.sucursal.nombre""",
      [id:productoId, ejercicio: ejercicio, mes: mes])

    Map existencia = [:]

    rows.each {row ->
      Date updated = new Date()
      String nombre = row[1].toString().replaceAll("\\s","")
      existencia[nombre.toLowerCase()] = [
        cantidad: row[0],
        apartado: 0,
        lastUpdated: updated
      ]
    }
    return  existencia
  }

  void actualizarExistencia(Producto p) {
    Map pojo = new LxProducto(p).toMap()
    Map existencia = fetchExistencia(p.id)
    pojo.existencia = existencia
    pojo.disponible = existencia.values().sum(0.0, {it.cantidad}).toDouble()

    DocumentReference docRef = this.papelsaCloudService
      .getFirestore()
      .document("productos/${p.id}")
    docRef.set(pojo, SetOptions.merge())
  }

  void exportarExistencias() {
    Date start = new Date()
    Integer ejercicio = Periodo.obtenerYear(new Date())
    Integer mes = Periodo.obtenerMes(new Date()) + 1
    List<Map> rows = Existencia.findAll(
      """select e.producto.id,e.clave, e.producto.descripcion, e.sucursal.nombre as sucursal, e.cantidad
      from Existencia e where e.anio=:ejercicio and e.mes=:mes and e.producto.inventariable=true
      order by e.producto.clave""",
      [ejercicio:ejercicio.toLong(), mes: mes.toLong()],
      [max: 7000])

    List<Map> existencias = rows.collect({row -> [
      productoId:row[0],
      clave: row[1],
      descripcion: row[2],
      sucursal: row[3],
      cantidad: row[4]
    ]})
      .groupBy({it.clave })
    .entrySet()
    .collect {
      String clave  = it.key.toString()
      List data = it.value

      Date lastUpdated = new Date()
      Map exis = [
        clave: clave,
        descripcion: data[0].descripcion,
        productoId: data[0].productoId,
        lastUpdated: lastUpdated
      ]
      data.each {rx ->

        String nombre = rx.sucursal.toString().replaceAll("\\s","")
        Map almacen = [
          cantidad: rx.cantidad,
          apartado: 0,
          dateUpdated: lastUpdated
        ]
        exis[nombre.toLowerCase()] = almacen
      }
      return exis
    }
    pushInBatch(existencias, 'existencias', 'productoId')
  }



  void pushInBatch(List<Map> rows, String collectionName, String idField = 'id') {
    log.info('Exportando registros a firebase collection: {}', collectionName)
    CollectionReference colRef = papelsaCloudService.getFirestore().collection(collectionName)
    WriteBatch batch = papelsaCloudService.getFirestore().batch()
    int count = 0
    rows.each { data ->
      DocumentReference docRef = colRef.document(data[idField])
      batch.set(docRef, data, SetOptions.merge())
      count++
      if(count % 400 == 0) {
        ApiFuture<List<WriteResult>> future = batch.commit()
        batch = papelsaCloudService.getFirestore().batch()
        log.info('Registros exportados {}', future.get().size())
      }
    }
    ApiFuture<List<WriteResult>> future = batch.commit()
    log.info('Registros exportados {}', future.get().size())
  }


}
