package sx.core

import groovy.transform.ToString
import groovy.transform.EqualsAndHashCode

@ToString(includes = 'id, descripcion',includeNames=true,includePackage=false)
@EqualsAndHashCode(includes='id, descripcion')
class ClienteComentarioTipo {

  String	id

  String	descripcion

  static mapping = {
    id generator: 'assigned'
  }
}
