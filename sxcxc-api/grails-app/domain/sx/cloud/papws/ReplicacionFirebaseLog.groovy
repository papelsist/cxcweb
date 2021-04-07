package sx.cloud.papws

import grails.compiler.GrailsCompileStatic
import groovy.transform.ToString

@GrailsCompileStatic
@ToString( includeNames=true,includePackage=false)
class ReplicacionFirebaseLog {

  String entity

  String entityId

  String tipo

  Date replicado

  String comentario

  Date lastUpdated


  static constraints = {
    comentario nullable: true
  }
}
