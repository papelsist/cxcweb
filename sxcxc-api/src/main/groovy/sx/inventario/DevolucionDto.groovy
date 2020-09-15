package sx.inventario

import groovy.transform.CompileStatic
import groovy.transform.Canonical
import groovy.transform.ToString
import sx.cfdi.CfdiDto
import sx.core.Cliente

// @CompileStatic
@Canonical
@ToString(includeNames = true)
class DevolucionDTO {

  String id
  Integer documento
  String sucursa
  Date fecha
  String tipo
  String cliente
  Long factura
  String uuid
  String moneda
  Double importe
  Double impuesto
  Double total
  boolean parcial

  DevolucionDTO() {}

}

