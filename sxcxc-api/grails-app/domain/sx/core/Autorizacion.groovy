package sx.core

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@ToString(excludes ='id,version',includeNames=true,includePackage=false)
@EqualsAndHashCode
class Autorizacion {

    String id

    String solicito

    String autorizo

    String comentario

    Date fecha
    String tipo
    String origen

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser

    static constraints = {
        comentario nullable:true
        createUser nullable:true
        updateUser nullable:true
    }

    static mapping = {
        id generator:'uuid'
        fecha type:'date', index: 'AUT_IDX1'
        solicito index: 'AUT_IDX2'
        autorizo index: 'AUT_IDX3'
    }
}
