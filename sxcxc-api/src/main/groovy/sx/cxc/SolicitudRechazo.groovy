package sx.cxc

import groovy.transform.ToString
import groovy.transform.EqualsAndHashCode
import grails.gorm.dirty.checking.DirtyCheck

@ToString(includeNames=true,includePackage=false)
@EqualsAndHashCode(includeFields = true,includes = ['dateCreated', 'motivo', 'comentario'])
@DirtyCheck
class SolicitudRechazo {
  String motivo
  String comentario
  String createUser
  Date dateCreated
  String uid
  Date replicado

  static constraints = {
    motivo nullable:true, maxSize: 50
    comentario nullable:true, maxSize: 250
    createUser nullable:true, maxSize: 50
    dateCreated nullable: true
    uid nullable: true, maxSize:30
    replicado nullable: true
  }
}
