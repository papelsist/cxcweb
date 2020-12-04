package sx.cxc

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.cfdi.Cfdi
import sx.cfdi.CancelacionDeCfdi
import sx.core.Cliente
import sx.core.Sucursal

@ToString(includes = 'cliente,fecha,sucursal,formaDePago,importe', includeNames=true,includePackage=false)
@EqualsAndHashCode(includeFields = true, includes = 'id, fecha, importe')
class  Cobro {

  String id

  Cliente cliente

  Sucursal sucursal

  String tipo

  Date fecha

  String formaDePago

  Currency moneda = Currency.getInstance('MXN')

  BigDecimal tipoDeCambio = 1.0

  BigDecimal importe

  String referencia

  Date primeraAplicacion

  Boolean anticipo = false

  Boolean enviado = false

  String sw2

  List<AplicacionDeCobro> aplicaciones = []

  BigDecimal aplicado = 0

  BigDecimal disponible = 0

  BigDecimal saldo = 0.0

  BigDecimal diferencia = 0.0

  Date diferenciaFecha

  String comentario

  Date fechaDeAplicacion

  String ingreso

  Cfdi cfdi

  Date dateCreated
  Date lastUpdated
  String createUser
  String updateUser

  Boolean requiereRecibo

  CancelacionDeCfdi cancelacionDeCfdi
  String cancelacionMotivo
  String reciboAnterior

  String anticipoSat

  static hasOne = [cheque: CobroCheque, deposito: CobroDeposito, transferencia: CobroTransferencia,tarjeta: CobroTarjeta]

  static hasMany =[aplicaciones: AplicacionDeCobro]

  static constraints = {
    tipo inList:['COD','CON','CRE','CHE','JUR']
    referencia nullable:true
    sw2 nullable:true, unique:true
    dateCreated nullable: true
    lastUpdated nullable: true
    createUser nullable: true
    updateUser nullable: true
    cheque nullable: true
    deposito nullable: true
    transferencia nullable: true
    tarjeta nullable: true
    primeraAplicacion nullable: true
    diferenciaFecha nullable: true
    diferencia nullable: true
    comentario nullable: true
    tipoDeCambio scale:6
    cfdi nullable: true
    //
    cancelacionDeCfdi nullable: true
    cancelacionMotivo nullable: true
    reciboAnterior nullable:true, maxSize: 100
    anticipoSat nullable: true
  }

  static mapping={
    id generator:'uuid'
    fecha type:'date' ,index: 'COBRO_IDX1'
    primeraAplicacion type: 'date'
    cliente index: 'COBRO_IDX2'
    formaDePago index: 'COBRO_IDX3'
    aplicaciones cascade: "all-delete-orphan"
    aplicado formula:'(select IFNULL( sum(x.importe * IFNULL(x.tipo_de_cambio, 1.0)), 0) from aplicacion_de_cobro x where x.cobro_id=id)'
    // aplicado formula:'(select IFNULL( sum(x.importe), 0) from aplicacion_de_cobro x where x.cobro_id=id)'
    saldo formula:' ( (importe * tipo_de_cambio) - (diferencia * tipo_de_cambio) -  (select IFNULL( sum(x.importe * IFNULL(x.tipo_de_cambio, 1.0)), 0) from aplicacion_de_cobro x where x.cobro_id=id) )'
    // saldo formula:' (importe  - diferencia  -  (select IFNULL( sum(x.importe), 0) from aplicacion_de_cobro x where x.cobro_id=id) )'
    diferenciaFecha type: 'date'
    requiereRecibo formula: "tipo in('CRE', 'CHE', 'JUR') and forma_de_pago not in('BONIFICACION', 'DEVOLUCION', 'PAGO_DIF')"
  }

  static transients = ['disponible', 'fechaDeAplicacion', 'ingreso']

  BigDecimal getDisponible(){
    return this.importe - this.aplicado - this.diferencia
  }

  def getIngreso() {
    if (deposito) {
      return deposito.ingreso?.id
    }else  if (transferencia) {
      return transferencia.ingreso?.id
    }
    return null;
  }

}
