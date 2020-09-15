package sx.cloud

import groovy.transform.CompileStatic
import groovy.transform.ToString

import sx.cxc.NotaDeCredito

@CompileStatic
@ToString(includeNames = true, includeFields = false, includePackage = false)
class LxAutorizacionBonificacion implements LxEntity {

  String cliente
  String nombre
  Date fecha
  String tipo
  Long folio
  Double total
  String comentario
  String solicitud
  String solicitudUser
  Map<String, Object> bonificacion
  String status

  LxAutorizacionBonificacion(NotaDeCredito nota) {
    cliente = nota.getCliente().getId()
    nombre = nota.getCliente().getNombre()
    fecha = new Date()
    tipo = nota.getTipo()
    setBonificacion(nota)
    folio = nota.folio
    total = nota.total.doubleValue()
    comentario = nota.getComentario()
    solicitudUser = nota.solicitudUser
    solicitud = nota.solicitud
    status = 'PENDIENTE'

  }

  LxAutorizacionBonificacion setBonificacion(NotaDeCredito nota) {
    LinkedHashMap<String, Object> map = new LinkedHashMap<String, Object>(15);
    map.put("id", nota.getId());
    map.put("sucursal", nota.getSucursal().getNombre());
    map.put("folio", nota.getFolio());
    map.put("fecha", nota.getFecha());
    map.put("total", nota.getTotal());
    map.put("tipo", nota.getTipo());
    map.put("cartera", nota.getTipoCartera());
    map.put("concepto", nota.getConcepto());
    map.put("tipoDeCalculo", nota.getTipoDeCalculo());
    map.put("baseDeCalculo", nota.getBaseDelCalculo());
    map.put("descuento", nota.getDescuento());
    map.put("descuento2", nota.getDescuento2());
    map.put("comentario", nota.getComentario());
    map.put("facturas", nota.getPartidas().size());

    this.bonificacion = ((Map<String, Object>) (map));
    return this;
  }
}
