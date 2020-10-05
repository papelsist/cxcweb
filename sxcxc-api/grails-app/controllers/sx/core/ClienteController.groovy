package sx.core

import grails.rest.RestfulController
import grails.plugin.springsecurity.annotation.Secured

import sx.core.Folio
import sx.cxc.CobranzaPorFechaCommand
import sx.cxc.Cobro
import sx.cxc.CuentaPorCobrar
import sx.cxc.NotaDeCredito
import sx.reports.ReportService
import sx.cfdi.Cfdi

@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
class ClienteController extends RestfulController<Cliente>{

    static responseFormats = ['json']

    ClienteService clienteService

    ReportService reportService

    ClienteController(){
        super(Cliente)
    }

    @Override
    @Secured("hasAnyRole('ROLE_CXC_ADMIN')")
    protected Cliente updateResource(Cliente resource) {

        log.info('Actualizando cliente: {}', resource)
        return clienteService.updateCliente(resource)
    }

    @Override
    protected List<Cliente> listAllResources(Map params) {
        params.sort = params.sort ?:'lastUpdated'
        params.order = params.order ?:'desc'

        log.info('List: {}', params)
        def query = Cliente.where {}

        if(params.term){
            def search = '%' + params.term + '%'
            query = query.where { nombre =~ search}
            return query.list(params)
        }

        if(params.tipo) {
            def tipo = params.tipo
            if(tipo == 'CREDITO') {
              log.info('CREDITO+++: {}', tipo)
              return ClienteCredito.findAll("select cr.cliente from ClienteCredito cr")
            } else if(tipo == 'CONTADO'){
              query = query.where {credito == null}
            } else {
            }
        }


        List<Cliente> clientes = query.list(params)
        log.debug('Clientes: {}', clientes.size())
        return clientes
    }


    /**** Finders ****/
    def facturas(Cliente cliente){
      params.max = 1000
      params.sort = 'fecha'
      params.order = 'asc'
      log.debug('Fetching facturas de cliente: {}', cliente.nombre)
      log.debug('Params: {}', params)
      def query = CuentaPorCobrar.where {cliente == cliente}
      if(params.getBoolean('pendientes')) {
        query = query.where{saldoReal > 0.0}
      } else {
        def periodo = params.periodo
        if(periodo) {
          query = query.where{fecha >= periodo.fechaInicial && fecha <= periodo.fechaFinal}
        }
      }
      List res = query.list(params)
      log.debug('Facturas: {}', res.size())
      respond res
    }

    def notas(Cliente cliente){
      params.max = 400
      params.sort = 'fecha'
      params.order = 'asc'
      log.debug('Fetching notas de credito para cliente: {}', cliente.nombre)
      log.debug('Params: {}', params)
      def query = NotaDeCredito.where {cliente == cliente}
      if(params.getBoolean('pendientes')) {
        query = query.where{cobro.saldo > 0.0}
      } else {
        def periodo = params.periodo
        if(periodo) {
          query = query.where{fecha >= periodo.fechaInicial && fecha <= periodo.fechaFinal}
        }
      }
      respond query.list(params)
    }

    def cobros(Cliente cliente){
      params.max = 100
      params.sort = 'fecha'
      params.order = 'desc'
      log.debug('Fetching notas de credito para cliente: {}', cliente.nombre)
      log.debug('Params: {}', params)
      def query = Cobro.where {cliente == cliente && requiereRecibo == true}
      if(params.getBoolean('pendientes')) {
        query = query.where{saldo > 0.0}
      } else {
        def periodo = params.periodo
        if(periodo) {
          query = query.where{fecha >= periodo.fechaInicial && fecha <= periodo.fechaFinal}
        }
      }
      respond query.list(params)
    }

    def cfdis(Cliente cliente){
      params.max = 1000
      params.sort = 'fecha'
      params.order = 'desc'
      log.debug('Fetching cfdis para cliente: {}', cliente.rfc)
      log.debug('Params: {}', params)
      def query = Cfdi.where {receptorRfc == cliente.rfc}
      def periodo = params.periodo
      if(periodo) {
        query = query.where{fecha >= periodo.fechaInicial && fecha <= periodo.fechaFinal}
      }
      respond query.list(params)
    }

    def socios(Cliente cliente){
        params.sort = 'nombre'
        params.order = 'asc'
        def rows = Socio.where {cliente == cliente}.list(params)
        respond rows
    }

    def estadoDeCuenta(CobranzaPorFechaCommand command){
        def repParams = [FECHA: command.fecha]
        repParams.ORIGEN = params.cartera
        repParams.CLIENTE = params.cliente
        def pdf =  reportService.run('EstadoDeCuentaCte.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'CobranzaCxc.pdf')
    }



}
