
package sx.cloud

import groovy.transform.ToString
import groovy.transform.EqualsAndHashCode

import grails.compiler.GrailsCompileStatic

@GrailsCompileStatic
@ToString(includeNames=true, includePackage=false)
@EqualsAndHashCode(includes = 'nombre')
class LxVentaPorLinea extends LxVentaAgregada {

  String id
  String nombre
  Map<String, LxVentaAgregada> sucursales
  Map tipos

}
