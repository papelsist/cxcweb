package sx.cloud

import groovy.transform.CompileStatic
import groovy.transform.ToString

@CompileStatic
@ToString(includeNames = true, includeFields = false, includePackage = false)
class Autorizacion {

  Date fecha
  String usuario
  String comentario

}
