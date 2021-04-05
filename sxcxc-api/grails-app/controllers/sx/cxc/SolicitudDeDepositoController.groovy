package sx.cxc

import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import groovy.transform.ToString
import groovy.util.logging.Slf4j
import sx.cloud.PapwsSolicitudesService
import sx.core.Folio
import sx.core.LogUser
import sx.core.Sucursal
import sx.reports.ReportService
import sx.tesoreria.SolicitudDeDepositoService
import sx.utils.Periodo

@Slf4j
@Secured("hasAnyRole('ROLE_ADMIN', 'ROLE_CXC', 'ROLE_CXC_ADMIN')")
class SolicitudDeDepositoController extends RestfulController<SolicitudDeDeposito> implements LogUser {

  static responseFormats = ['json']

  ReportService reportService

  SolicitudDeDepositoService solicitudDeDepositoService

  PapwsSolicitudesService papwsSolicitudesService

  SolicitudDeDepositoController() {
    super(SolicitudDeDeposito)
  }

  @Override
  protected List listAllResources(Map params) {
    params.max = params.registros ?: 1000
    params.sort = params.sort ?: 'lastUpdated'
    params.order = params.order ?: 'desc'
    def query = SolicitudDeDeposito.where {}
    if (params.cartera) {
      def cartera = params.cartera
      if (cartera == 'CRE') {
        query = query.where { tipo == 'CRE' || tipo == 'CHE' || tipo == 'JUR' }
      } else {
        query = query.where { tipo == cartera }
      }
    }
  }

  def pendientes() {
    params.max = 100
    params.sort = params.sort ?: 'lastUpdated'
    params.order = params.order ?: 'desc'
    log.info('Pendientes: {}', params)
    Date inicio = Date.parse('dd/MM/yyyy', '01/03/2021')
    def query = SolicitudDeDeposito.where {
      // cobro == null && cancelacion == null
      createUser != null
    }
    query = query.where {
      fecha >= inicio
    }
    def seccion = params.seccion
    if (session == 'CHO')
      query = query.where { tipo == 'CHO' }
    else
      query = query.where { tipo == 'CRE' || tipo == 'CHE' || tipo == 'JUR' }

    def list = query.list(params)
    respond list
  }

  def autorizadas(SolicitudFilter filter) {
    log.info('Solicitudes autorizdas {}', params)
    params.max = 500
    params.sort = params.sort ?: 'lastUpdated'
    params.order = params.order ?: 'desc'

    def query = SolicitudDeDeposito.where {
      cobro != null
    }
    if (params.cartera) {
      query = query.where { tipo == params.cartera }
    }

    if (params.periodo) {
      Periodo periodo = new Periodo()
      bindData(periodo, params.periodo)
      // log.debug('Periodo: {}', periodo)
      query = query.where { fecha >= periodo.fechaInicial && fecha <= periodo.fechaFinal }

    }

    if (params.folio && params.folio.isInteger()) {
      // log.debug('Buscando por Folio: ', params.folio.toInteger())
      query = query.where { folio == params.folio.toInteger() }
    }

    if (params.total && params.total.isBigDecimal()) {
      // log.debug('Buscando por total: {}', params.total.toBigDecimal())
      query = query.where { total == params.total.toBigDecimal() }
    }

    if (filter.fechaDeposito) {
      // log.debug('Buscando por fecha deposito: {}', filter.fechaDeposito)
      query = query.where { fechaDeposito == filter.fechaDeposito }
    }
    if (filter.fechaCobranza) {
      // log.debug('Buscando por fecha cobranza: {}', filter.fechaCobranza)
      query = query.where { cobro.primeraAplicacion == filter.fechaCobranza }
    }

    if (filter.fechaCobranza) {
      log.debug('Buscando por fecha cobranza: {}', filter.fechaCobranza)
      query = query.where { cobro.primeraAplicacion == filter.fechaCobranza }
    }

    if (params.cliente) {
      // log.debug('Filtrando por cliente')
      String search = '%' + params.cliente + '%'
      query = query.where { cliente.nombre =~ search }
    }

    if (params.sucursal) {
      // log.debug('Filtrando por sucursal: {}', params.sucursal)
      String search = '%' + params.sucursal + '%'
      query = query.where { sucursal.nombre =~ search }
    }
    if (params.banco) {
      String search = '%' + params.banco + '%'
      query = query.where { cuenta.descripcion =~ search }
    }

    if (params.tipo) {
      String tipo = params.tipo
      query = query.where { cobro.tipo =~ tipo }
    }

    if (params.formaDePago) {
      String search = '%' + params.formaDePago + '%'
      query = query.where { cobro.formaDePago =~ search }
    }


    def list = query.list(params)
    respond list
  }


  def canceladas(SolicitudFilter filter) {
    //log.debug('Buscando solicitudes transito {}', params)
    // log.debug('Filter: {}', filter)
    params.max = 50
    params.sort = params.sort ?: 'lastUpdated'
    params.order = params.order ?: 'desc'

    def query = SolicitudDeDeposito.where {
      cancelacion != null
    }

    if (params.folio && params.folio.isInteger()) {
      // log.debug('Buscando por Folio: ', params.folio.toInteger())
      query = query.where { folio == params.folio.toInteger() }
    }

    if (params.total && params.total.isBigDecimal()) {
      // log.debug('Buscando por total: ', params.total.toBigDecimal())
      query = query.where { total == params.total.toBigDecimal() }
    }

    if (filter.fechaDeposito) {
      // log.debug('Buscando por fecha: {}', filter.fechaDeposito)
      query = query.where { fechaDeposito == filter.fechaDeposito }
    }

    if (filter.fechaCobranza) {
      // log.debug('Buscando por fecha cobranza: {}', filter.fechaCobranza)
      query = query.where { cobro.primeraAplicacion == filter.fechaCobranza }
    }

    if (params.cliente) {
      // log.debug('Filtrando por cliente')
      String search = '%' + params.cliente + '%'
      query = query.where { cliente.nombre =~ search }
    }

    if (params.sucursal) {
      // log.debug('Filtrando por sucursal: {}', params.sucursal)
      String search = '%' + params.sucursal + '%'
      query = query.where { sucursal.nombre =~ search }
    }

    def list = query.list(params)
    respond list
  }

  @Override
  protected SolicitudDeDeposito createResource() {
    SolicitudDeDeposito sol = new SolicitudDeDeposito()
    bindData sol, getObjectToBind()
    sol.sucursal = Sucursal.where { clave == 1 }.find()
    sol.fecha = new Date()
    return sol
  }

  protected SolicitudDeDeposito saveResource(SolicitudDeDeposito resource) {
    resource.total = resource.cheque + resource.efectivo + resource.transferencia
    // log.debug('Salvando solicitud: {}', resource)
    def serie = resource.sucursal.nombre
    resource.folio = Folio.nextFolio('SOLICITUDES_DEPOSITO', serie)
    resource.comentario = 'GENERADA EN LA NUEVA VERSION'
    logEntity(resource)
    resource.validate()
    log.info('Errors: ', resource.errors)
    SolicitudDeDeposito sol = super.saveResource(resource)
    this.papwsSolicitudesService.pushSolicitud(sol)
    return sol
  }

  @Override
  protected SolicitudDeDeposito updateResource(SolicitudDeDeposito resource) {
    log.debug('Actualizando solicitud: {} ', resource)
    // resource.total = resource.cheque + resource.efectivo + resource.transferencia
    resource.comentario = 'ACTUALIZADA EN LA NUEVA VERSION'
    logEntity(resource)
    resource = resource.save flush: true
    this.papwsSolicitudesService.updateInFirebase(resource)
    return resource
  }


  def cobranzaContado(SolsFechaSucursalCommand command) {
    Map repParams = [:]
    repParams.FECHA = command.fecha.format('yyyy/MM/dd')
    repParams['SUCURSAL'] = command.sucursal.id
    def pdf = reportService.run('FacturasCobrada', repParams)
    render(file: pdf.toByteArray(), contentType: 'application/pdf', filename: "CobranzaContado.pdf")
  }

  def cobranzaCod(SolsFechaSucursalCommand command) {
    Map repParams = [:]
    repParams.FECHA = command.fecha.format('yyyy/MM/dd')
    repParams['SUCURSAL'] = command.sucursal.id
    repParams['SALDOAFAVOR'] = 0.0
    def pdf = this.reportService.run('CobranzaCamioneta', repParams)
    def fileName = "CobranzaCOD.pdf"
    render(file: pdf.toByteArray(), contentType: 'application/pdf', filename: fileName)

  }

  def disponibles(SolsFechaSucursalCommand command) {
    Map repParams = [:]
    repParams.FECHA = command.fecha.format('yyyy/MM/dd')
    repParams['SUCURSAL'] = command.sucursal.id
    def pdf = this.reportService.run('DisponiblesSucursal', repParams)
    def fileName = "DisponiblesSucursal.pdf"
    render(file: pdf.toByteArray(), contentType: 'application/pdf', filename: fileName)

  }

  def ventasDiarias(SolsFechaSucursalCommand command) {
    Map repParams = [:]
    repParams.FECHA = command.fecha.format('yyyy/MM/dd')
    repParams['SUCURSAL'] = command.sucursal.id
    repParams['ORIGEN'] = params.origen
    def pdf = this.reportService.run('ventas_diarias', repParams)
    def fileName = "VentasDiarias.pdf"
    render(file: pdf.toByteArray(), contentType: 'application/pdf', filename: fileName)

  }


}

@ToString(includeNames = true, includePackage = false)
class SolicitudFilter {
  Date fechaDeposito
  Date fechaCobranza

  static constraints = {
    fechaDeposito nullable: true
    fechaCobranza nullable: true
  }

}

class SolsFechaSucursalCommand {
  Date fecha
  Sucursal sucursal

  String toString() {
    return " ${sucursal.nombre} ${fecha.format('dd/MM/yyyy')}"
  }
}

class PosibleDuplicadoCommand {
  String banco
  String cuenta
  BigDecimal total
  Date fechaDeposito

}
