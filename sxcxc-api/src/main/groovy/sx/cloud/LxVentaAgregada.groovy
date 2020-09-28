
package sx.cloud

import groovy.transform.ToString
import groovy.transform.EqualsAndHashCode

import grails.compiler.GrailsCompileStatic

@GrailsCompileStatic
@ToString(includeNames=true, includePackage=false)
class LxVentaAgregada implements LxEntity {

  Double cantidad
  Double kilos
  Double venta
  Double costo
  Double utilidad
  Date updated

}
