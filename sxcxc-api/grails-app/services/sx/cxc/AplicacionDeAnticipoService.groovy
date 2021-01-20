package sx.cxc

import groovy.util.logging.Slf4j

import grails.gorm.transactions.Transactional
import org.apache.commons.lang3.exception.ExceptionUtils

import lx.cfdi.v33.Comprobante
import com.luxsoft.cfdix.v33.NotaBuilder

import sx.core.Cliente
import sx.core.Sucursal
import sx.core.Folio
import sx.cfdi.Cfdi
import sx.cfdi.CancelacionDeCfdi
import sx.cxc.CuentaPorCobrar

import sx.core.LogUser
import sx.core.AppConfig
import sx.cfdi.CfdiService
import sx.cfdi.CancelacionService
import sx.cfdi.CfdiTimbradoService
import sx.utils.MonedaUtils

@Transactional
@Slf4j
class AplicacionDeAnticipoService implements LogUser {

  NotaBuilder notaBuilder

  CfdiService cfdiService

  CfdiTimbradoService cfdiTimbradoService

  CancelacionService cancelacionService

  def timbrar(AnticipoSatDet aplicacion){
    if(aplicacion.egresoUuid)
      throw new RuntimeException('Aplicación de anticipo ya timbrada')

    NotaDeCredito nota = generarNota(aplicacion)
    def cfdi = generarCfdi(nota)
    cfdi = cfdiTimbradoService.timbrar(cfdi)
    nota.cfdi = cfdi
    // nota.cobro = generarCobro(nota)
    nota.save failOnError: true, flush: true

    aplicacion.egresoCfdi = cfdi.id
    aplicacion.egresoUrl = cfdi.url
    aplicacion.egresoUuid = cfdi.uuid
    aplicacion = aplicacion.save failOnError: true, flush: true
    return aplicacion
  }

  NotaDeCredito generarNota(AnticipoSatDet apl) {

    def tot = apl.importe
    def imp = MonedaUtils.calcularImporteDelTotal(tot)
    def iva = tot - imp

    def nota = new NotaDeCredito()
    nota.with {
      tipo = 'ANTICIPO'
      serie = 'APL_ANTICIPO'
      cliente = Cliente.get(apl.anticipo.cliente)
      nombre = apl.anticipo.nombre
      concepto = 'ANTICIPO_APL'
      comentario = apl.comentario
      tipoCartera = 'CON'
      usoDeCfdi = 'G01'
      importe = imp
      impuesto = iva
      total = tot
      formaDePago = 'ANTICIPO'
      sucursal = Sucursal.findByNombre('OFICINAS')
    }

    def cxc = CuentaPorCobrar.get(apl.cxc)
    if(!cxc)
      throw new RuntimeException("No exsite la cuenta por cobrar: ${apl.cxcTipo}-${apl.cxcDocumento} (${apl.anticipo.sucursal}) de Id: ${apl.cxc}")
    nota.addToPartidas(new NotaDeCreditoDet(
      impuesto: nota.impuesto,
      importe: nota.importe,
      total: nota.total,
      documento: apl.cxcDocumento,
      tipoDeDocumento: apl.cxcTipo,
      fechaDocumento: apl.fecha,
      totalDocumento: apl.importe,
      sucursal: apl.anticipo.sucursal,
      comentario: 'Aplicacion de anticipo',
      uuid: apl.uuid,
      cuentaPorCobrar: cxc
    ))

    return save(nota)
  }

  /**
  * Persiste la nota de crédito asignandole folio
  */
  def save(NotaDeCredito nota) {
    if(nota.id) throw new NotaDeCreditoException("Nota existente Id: ${nota.id}");
    nota.folio = Folio.nextFolio('NOTA_DE_CREDITO', nota.serie)
    logEntity(nota)
    nota.save failOnError: true, flush: true
  }

  def generarCfdi(NotaDeCredito nota) {
    Comprobante comprobante = this.notaBuilder.build(nota);
    Cfdi cfdi = cfdiService.generarCfdi(comprobante, 'E', 'NOTA_CREDITO')
    return cfdi
  }

}

