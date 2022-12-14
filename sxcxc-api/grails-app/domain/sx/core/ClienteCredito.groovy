package sx.core

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@EqualsAndHashCode(includes = 'id')
@ToString(includes= ['lineaDeCredito', 'plazo', 'saldo'], includeNames = true, includePackage = false)
class ClienteCredito {

  String id

  Boolean creditoActivo = true

  Double descuentoFijo = 0.0

  Double lineaDeCredito = 0.0

  Long plazo = 1

  Boolean venceFactura = true

  Long diaRevision = 0

  Long diaCobro = 0

  Boolean revision = true

  BigDecimal saldo = 0.0

  Long atrasoMaximo = 0.0

  Boolean postfechado = false

  Long operador = 0

  Cobrador cobrador

  Socio socio
  Cliente cliente

  Long sw2

  Date dateCreated
  Date lastUpdated
  String createUser
  String updateUser


  static constraints = {
    cobrador nullable: true
    socio nullable: true
    sw2 nullable: true
    createUser nullable: true
    updateUser nullable: true
    dateCreated nullable: true
    lastUpdated nullable: true
  }

  static belongsTo = [cliente: Cliente]

  static mapping = {
    id generator: 'uuid'
  }
}
