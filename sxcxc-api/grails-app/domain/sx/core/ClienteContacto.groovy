package sx.core

import groovy.transform.ToString
import groovy.transform.EqualsAndHashCode

@ToString(includes = 'nombre, puesto, email',includeNames=true,includePackage=false)
@EqualsAndHashCode(includes='nombre, puesto, email')
class ClienteContacto {

  String id

  String nombre

  String puesto

  String email

  String telefono

  Date dateCreated
  Date lastUpdated

  String createUser
  String updateUser

  static belongsTo = [cliente: Cliente]

  static constraints = {
    email nullable: true
    telefono nullable: true
    createUser nullable: true
    updateUser nullable: true
  }

  static mapping={
    id generator:'uuid'
  }

}
