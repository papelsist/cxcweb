package sx.cxc

import groovy.util.logging.Slf4j
import groovy.transform.ToString

import grails.rest.RestfulController
import grails.plugin.springsecurity.annotation.Secured

import sx.core.Cliente
import sx.core.Cobrador
import sx.core.Sucursal
import sx.reports.ReportService

@Slf4j
@Secured("hasAnyRole('ROLE_ADMIN', 'ROLE_CXC', 'ROLE_AUTORIZACION_CXC', 'ROLE_CXC_ADMIN')")
class VentaCreditoController extends RestfulController<VentaCredito>{

    static responseFormats = ['json']

    ReportService reportService

    RevisionService revisionService

    VentaCreditoController(){
        super(VentaCredito)
    }


    def pendientes() {
        def rows = revisionService.buscarPendientes()
        // log.debug('Registros encontrados: ', )
        respond rows
    }


    protected VentaCredito updateResource(VentaCredito resource) {
        this.revisionService.update(resource)
    }

    def recalcular() {
        List<VentaCredito> res = revisionService.actualizar()
        respond res
    }

    def registrarRecepcionCxC(BatchUpdateCommand command){
        log.info('Registrando recepcion  de {} facturas ', command.facturas.size())
        List<VentaCredito> facturas = command.facturas;
        facturas.each { credito ->
            credito.fechaRecepcionCxc = new Date()
            credito = this.revisionService.update(credito)
        }
        respond facturas
    }

    def cancelarRecepcionCxC(BatchUpdateCommand command){
        log.debug('Cancelar recepcion en cxc   de {} facturas ', command.facturas.size())
        List<VentaCredito> facturas = command.facturas.findAll{ !it.revisada }
        facturas.each { credito ->
          credito.fechaRecepcionCxc = null
          credito = this.revisionService.update(credito)
        }
        respond facturas
    }

  def registrarRvisada(BatchUpdateCommand command){

    boolean value = params.getBoolean('value', true)
    log.info('Registrando revisadas  de {} facturas Value: {} Params: {}', command.facturas.size(), value, params)
    List<VentaCredito> facturas = command.facturas.findAll{ it.fechaRecepcionCxc  }
    log.debug('Califican facturas: {}', facturas.size())
    facturas.each { credito ->
      credito.revisada = value
      credito = this.revisionService.update(credito)
    }
    respond facturas
  }



    def batchUpdate(BatchUpdateCommand command){
      log.info('Batch update de {} facturas con {}', command.facturas.size(), command.template)
      List<VentaCredito> facturas = command.facturas;
      facturas.each { credito ->
        bindData(credito, command.template)
        credito = this.revisionService.update(credito)
      }
      respond facturas
    }

    def print(RevisionCobroCommand command) {
        log.info ('Command: {}', command)
        def realPath = servletContext.getRealPath("/reports") ?: 'reports'
        params.FECHA = command.fecha
        params.COBRADOR = command.cobrador ? command.cobrador.id : '%'
        params.CLIENTE = command.cliente ? command.cliente.id : '%'
        def pdf = reportService.run('FacturasAcobroYRevision.jrxml', params)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'Antiguead.pdf')
    }

    def ventasAcumuladas(VentaAcumulada command) {
        log.info('Venta acumulada {}', command)
        def realPath = servletContext.getRealPath("/reports") ?: 'reports'
        params.FECHA_INI = command.fechaIni
        params.FECHA_FIN = command.fechaFin
        if(command.sucursal) {
            params.SUCURSAL = command.sucursal.id
            def pdf = reportService.run('VentasSucursal.jrxml', params)
            render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'VentasSucursal.pdf')
        } else {
            def pdf = reportService.run('VentasEmpresa.jrxml', params)
            render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'VentasEmpresa.pdf')
        }

    }

    def ventaPorFacturista(VentaAcumulada command) {
        log.info('Venta por facturista {}', command)
        def realPath = servletContext.getRealPath("/reports") ?: 'reports'
        params.FECHA_INI = command.fechaIni
        params.FECHA_FIN = command.fechaFin
        params.SUCURSAL = command.sucursal.id
        def pdf = reportService.run('VentasFacturista.jrxml', params)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'VentasFacturista.pdf')

    }


    def ventaPorCliente(VentaPorCliente command) {
        log.info('Venta por facturista {}', command)
        def realPath = servletContext.getRealPath("/reports") ?: 'reports'
        params.FECHA_INI = command.fechaIni
        params.FECHA_FIN = command.fechaFin
        params.CLIENTE = command.cliente.id
        params.SUCURSAL = command.sucursal
        params.ORIGEN = command.origen
        def pdf = reportService.run('ventas_por_cliente.jrxml', params)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'VentaPorCliente.pdf')
    }


}

public class BatchUpdateCommand {
    VentaCreditoCommand template;
    List<VentaCredito> facturas;

    static constraints = {
        template nullable: true
    }
}


public class RevisionCobroCommand {
    Date fecha
    Cliente cliente
    Cobrador cobrador

    static constraints = {
        cliente nullable: true
        cobrador nullable: true
    }

    String toString() {
        "${fecha.format('dd/MM/yyyy')} ${cliente?.nombre} ${cobrador?.nombres}"
    }

}

@ToString(includeNames=true,includePackage=false)
public class VentaCreditoCommand {

    Integer plazo
    Integer diaRevision
    Integer diaPago
    Boolean vencimientoFactura
    Date fechaRevision
    Cobrador cobrador
    String comentario
    String comentarioReprogramarPago

    static constraints = {
        plazo nullable:true
        diaRevision nullable:true
        diaPago nullable:true
        vencimientoFactura nullable:true
        fechaRevision nullable:true
        cobrador nullable:true
        comentario nullable: true
        comentarioReprogramarPago nullable:  true
    }
}

@ToString(includeNames=true,includePackage=false)
public class VentaAcumulada {

    Date fechaIni
    Date fechaFin
    Sucursal sucursal

    static constraints = {
        sucursal nullable:true
    }

}

@ToString(includeNames=true,includePackage=false)
public class VentaPorCliente {

    Date fechaIni
    Date fechaFin
    String origen
    Cliente cliente
    String sucursal

    static constraints = {}

}



/*

*/
