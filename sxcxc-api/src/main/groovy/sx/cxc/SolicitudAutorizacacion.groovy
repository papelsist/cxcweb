package sx.cxc

import grails.gorm.dirty.checking.DirtyCheck

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@ToString(includeNames=true,includePackage=false)
@EqualsAndHashCode(includeFields = true)
@DirtyCheck
class SolicitudAutorizacacion {
  Date fecha
  String uid
  String createUser
  String comentario

  static constraints = {
    createUser nullable:true, maxSize: 50
    uid nullable: true, maxSize:30
    comentario nullable: true, maxSize: 200

  }
}
