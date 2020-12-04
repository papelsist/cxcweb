package sx.cxc

import groovy.util.logging.Slf4j

import grails.rest.RestfulController
import grails.plugin.springsecurity.annotation.Secured

import sx.reports.ReportService
import sx.core.Cliente

import sx.core.Sucursal
import sx.utils.ImporteALetra


@Secured("hasAnyRole('ROLE_ADMIN', 'ROLE_CXC', 'ROLE_CXC_ADMIN')")
@Slf4j
class CuentaPorCobrarController extends RestfulController<CuentaPorCobrar>{

    static responseFormats = ['json']

    ReportService reportService

    CuentaPorCobrarService cuentaPorCobrarService

    AntiguedadService antiguedadService

    CuentaPorCobrarController() {
        super(CuentaPorCobrar)
    }

    @Override
    def show() {
        CuentaPorCobrar cxc = CuentaPorCobrar.get(params.id)
        [cxc: cxc]
    }

    @Override
    protected List<CuentaPorCobrar> listAllResources(Map params) {

        def query = CuentaPorCobrar.where {}
        params.sort = params.sort ?:'lastUpdated'
        params.order = params.order ?:'desc'
        params.max = 100
        log.info('[GET] {}', params)

        if(params.cartera) {
            String cartera = params.cartera
            query = query.where{tipo == cartera}
        }
        def pendientes = params.pendientes
        log.info('Pendientes: {}', pendientes)
        if(params.pendientes != null) {
            log.info('Enviando toda la cartera')
            query = query.where{saldoReal > 0.0}
            return query.list([sort: 'fecha', order: 'desc', max: 300])
        }

        def periodo = params.periodo
        query = query.where{fecha >= periodo.fechaInicial && fecha <= periodo.fechaFinal}
        return query.list(params)
    }

    def search() {
      log.debug('Search [GET] {}', params)
        def query = CuentaPorCobrar.where { }
        params.sort = params.sort ?: 'documento'
        params.order = params.order ?:'asc'
        params.max = params.max?: 100

        log.info("Search: {}", params)

        if(params.cartera){
            def cart = params.cartera
            switch (cart) {
                case 'CRE':
                    query = query.where{ tipo == 'CRE' && juridico == null}
                    break
                case 'CON':
                    query = query.where{ tipo == 'CON' || tipo == 'COD' && juridico == null}
                    break
                case 'JUR':
                    query = query.where{juridico != null}
                    break
                default:
                    query = query.where{ tipo == cart && juridico == null}
            }
        }
        /*
        if(params.fechaInicial) {
            Date fechaInicial = params.getDate('fechaInicial', 'yyyy-MM-dd')
            Date fechaFinal = params.getDate('fechaFinal', 'yyyy-MM-dd') ?: fechaInicial
            query = query.where { fecha >= fechaInicial && fecha <= fechaFinal}

        }
        */

        if(params.clienteId){
            def clienteId = params.clienteId
            query = query.where { cliente.id =~ clienteId}
        }

        Long documento = params.getLong('documento')
        if(documento) {
          query = query.where { documento == documento }
        }

        respond query.list(params)

    }

    def facturas() {
        params.sort = params.sort ?: 'lastUpdated'
        params.order = params.order ?:'desc'
        params.max = params.max ?: 200
        def periodo = params.periodo
        def cartera = params.cartera
        def pendientes = params.pendientes
        log.info('Facturas [GET] {}', params)
        if(pendientes) {
          log.info('Enviando toda la cartera')
          respond cuentaPorCobrarService.findAllPendientes(cartera)
        } else {
          respond cuentaPorCobrarService.findAll(cartera, periodo, params)
        }
    }

    def pendientes(Cliente cliente) {
        if (cliente == null) {
            notFound()
            return
        }
        log.debug('Cuentas por cobrar pendientes: {}', params)
        respond cuentaPorCobrarService.findPendientes(cliente, params.cartera)
    }

    def antiguedad(){
        // Antiguedad de saldos

        def rows = antiguedadService.antiguedad()
        respond rows
    }

    def saldar(CuentaPorCobrar cxc) {
        log.debug('Saldando cuenta por cobrar: {}', cxc.folio)
        cuentaPorCobrarService.saldar(cxc)
        cxc.refresh()
        log.debug('Factura {} saldada: {}', cxc.folio, cxc.saldoReal)
        // respond(cxc, view: 'show')
        respond cxc
    }

    def printAntiguedad() {
        log.debug('Params: {}', params)
        Date fecha = params.getDate('fecha', 'dd/MM/yyyy')
        def repParams = [:]
        repParams.CORTE = fecha
        repParams.ORDER = params.int('sort')
        repParams.FORMA = params.order
        def realPath = servletContext.getRealPath("/reports") ?: 'reports'
        def pdf = reportService.run('AntiguedadSaldosGral.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'Antiguead.pdf')
    }

    def reporteDeCobranzaCOD(CobranzaCodCommand command) {
        def repParams = [:]
        repParams.FECHA = command.fecha.format('yyyy-MM-dd')
        repParams.SUCURSAL = command.sucursal.id
        def realPath = servletContext.getRealPath("/reports") ?: 'reports'
        def pdf = reportService.run('CarteraCOD_Emb.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'CarteraCOD.pdf')
    }

    def antiguedadPorCliente(AntiguedadPorCteCommand command) {
        def realPath = servletContext.getRealPath("/reports") ?: 'reports'
        def repParams = [:]
        repParams.FECHA_CORTE = command.fecha
        repParams.CLIENTE = command.cliente.id
        def pdf = reportService.run('AntiguedadSaldosConCortePorCliente.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'Antiguead.pdf')
    }

    def clientesSuspendidosCre() {
        def repParams = [:]
        def realPath = servletContext.getRealPath("/reports") ?: 'reports'
        def pdf = reportService.run('ClientesSuspendidosCredito.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'ClientesSuspendidosCredito.pdf')
    }

    def facturasConNotaDevolucion(FacturasConNtaCommand command) {
        def repParams = [:]

        repParams.SUCURSAL = command.sucursal ? command.sucursal.id : '%'
        repParams.FECHA_INI = command.fechaIni
        repParams.FECHA_FIN = command.fechaFin
        if(command.origen == 'CRE') {
            repParams.ORIGEN = 'CRE'
        } else if(command.origen == 'CON') {
            repParams.ORIGEN = 'CO%'
        } else {
            repParams.ORIGEN = '%'
        }

        def realPath = servletContext.getRealPath("/reports") ?: 'reports'
        def pdf = reportService.run('FacsCancPorNotaDev.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'FacsCancPorNotaDev.pdf')

    }

    def reporteExceptionesDescuentos(FacturasConNtaCommand command) {
        def repParams = [:]
        repParams.SUCURSAL = command.sucursal ? command.sucursal.id : '%'
        repParams.FECHA_INI = command.fechaIni
        repParams.FECHA_FIN = command.fechaFin
        repParams.ORIGEN = command.origen
        def realPath = servletContext.getRealPath("/reports") ?: 'reports'
        def pdf = reportService.run('ExcepcionesEnDescuento.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'FacsCancPorNotaDev.pdf')
    }


    def generarPagare() {
        def realPath = servletContext.getRealPath("/reports") ?: 'reports'

        CuentaPorCobrar cxc = CuentaPorCobrar.get(params.id)
        Map repParams = [ID: params.id]
        repParams.TELEFONOS = "Tels: " + cxc.cliente.telefonos.join(', ')
        repParams.IMPORTE_LETRA = ImporteALetra.aLetra(cxc.total)
        def pdf = reportService.run('Pagare.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'Pagare.pdf')
    }

    def traspasoJuridico(TraspasoCommand command) {
        def realPath = servletContext.getRealPath("/reports") ?: 'reports'
        Map repParams = [ID: params.id]
        repParams.FECHA_INI = command.fechaInicial
        repParams.FECHA_FIN = command.fechaFinal
        def pdf = reportService.run('TraspasoAJuridico.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'Traspaso_AJuridico.pdf')
    }




}

class CobranzaCodCommand {
    Sucursal sucursal
    Date fecha

    static constraints = {
        sucursal nullable: true
    }
}

class AntiguedadPorCteCommand {
    Date fecha
    Cliente cliente
}

class FacturasConNtaCommand {
    Date fechaIni
    Date fechaFin
    Sucursal sucursal
    String origen

    static constraints = {
        sucursal nullable: true
    }
}

class TraspasoCommand {

  Date fechaInicial
  Date fechaFinal

}
