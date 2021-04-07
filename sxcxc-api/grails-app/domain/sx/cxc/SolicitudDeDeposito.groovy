package sx.cxc

import java.text.SimpleDateFormat
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

import sx.core.Cliente
import sx.core.Sucursal

import sx.tesoreria.Banco
import sx.tesoreria.CuentaDeBanco

@ToString(excludes = 'id, cliente, sucursal, efectivo, cheque, transferencia, total', includeNames = true, includePackage = false)
@EqualsAndHashCode(includeFields = true, includes = ['id', 'sucursal', 'folio'])
class SolicitudDeDeposito {

  String id

  Sucursal sucursal

  Cliente cliente

  Cobro cobro

  Banco banco

  CuentaDeBanco cuenta

  String tipo = 'NORMAL'

  Integer folio = 0

  Date fecha

  Date fechaDeposito

  String referencia

  BigDecimal cheque = 0.0

  BigDecimal efectivo = 0.0

  BigDecimal transferencia = 0.0

  BigDecimal total = 0.0

  String comentario

  Date cancelacion

  String cancelacionComentario

  Boolean enviado = false
  String sw2

  Date dateCreated
  Date lastUpdated

  String createUser
  String updateUser

  SolicitudRechazo rechazo

  SolicitudAutorizacacion auth

  Boolean callcenter
  Date replicadoFirestore

  Map toFirebase() {

    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    sdf.setTimeZone(TimeZone.getTimeZone("CET"))

    SolicitudDeDeposito sol = this;
    Map<String, Object> data = [
      id           : sol.id,
      folio        : sol.folio,
      sucursal     : sol.sucursal.nombre,
      sucursalId   : sol.sucursal.id,
      tipo         : sol.tipo == 'NORMAL' ? 'CON' : sol.tipo,
      callcenter   : sol.sw2 ? true: false,
      fecha        : sdf.format(sol.fecha),
      cliente      : [id    : sol.cliente.id,
                      nombre: sol.cliente.nombre,
                      rfc   : sol.cliente.rfc,
                      clave : sol.cliente.clave],
      banco        : [id: sol.banco.id, nombre: sol.banco.nombre],
      cuenta       : [id         : sol.cuenta.id,
                      descripcion: sol.cuenta.descripcion,
                      numero     : sol.cuenta.numero,
                      bancoId    : sol.cuenta.banco.id],
      solicita     : sol.createUser,
      fechaDeposito: sdf.format(sol.fechaDeposito),
      referencia   : sol.referencia,
      transferencia: sol.transferencia.toDouble(),
      efectivo     : sol.efectivo.toDouble(),
      cheque       : sol.cheque.toDouble(),
      total        : sol.total.toDouble(),
      sbc          : sol.cheque > 0.0 ? sol.banco.id != sol.cuenta.banco.id : false,
      dateCreated  : sdf.format(sol.dateCreated),
      lastUpdated  : sdf.format(sol.lastUpdated),
      createUser   : [uid: sol.createUser, displayName: sol.createUser],
      updateUser   : [uid: sol.createUser, displayName: sol.createUser],
      status       : sol.cobro ? 'AUTORIZADO': 'PENDIENTE',
      appVersion   : 1,
    ] as Map<String, Object>
    return data
  }

  static embedded = ['rechazo', 'auth']

  static mapping = {
    id generator: 'uuid'
    fechaDeposito type: 'date'
    fecha type: 'date'
  }

  static constraints = {
    sw2 nullable: true
    cobro nullable: true
    cancelacion nullable: true
    cancelacionComentario nullable: true
    comentario nullable: true
    createUser nullable: true
    updateUser nullable: true
    auth nullable: true
    rechazo nullable: true
    callcenter nullable: true
    replicadoFirestore nullable: true
  }
}



