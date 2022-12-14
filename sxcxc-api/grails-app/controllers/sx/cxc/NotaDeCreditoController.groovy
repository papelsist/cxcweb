package sx.cxc

import groovy.util.logging.Slf4j

import grails.gorm.transactions.Transactional
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController

import org.apache.commons.lang3.exception.ExceptionUtils
import sx.cxc.NotaDeCreditoService
import com.luxsoft.cfdix.v33.NotaPdfGenerator
import sx.cloud.LxAutorizacionService
import sx.inventario.DevolucionDeVenta
import sx.reports.ReportService
import sx.utils.Periodo

import static org.springframework.http.HttpStatus.OK

/**
 * Controlador central REST de notas de credito CxC
 *
 */
@Slf4j
@Secured("hasAnyRole('ROLE_ADMIN', 'ROLE_CXC', 'ROLE_AUTORIZACION_CXC', 'ROLE_CXC_ADMIN', 'ROLE_CXC_CONTADO')")
class NotaDeCreditoController extends RestfulController<NotaDeCredito> {

  static responseFormats = ['json']

  NotaDeCreditoService notaDeCreditoService

  ReportService reportService

  LxAutorizacionService lxAutorizacionService

  NotaDeCreditoController() {
    super(NotaDeCredito)
  }

  /*
  @Transactional
  def save() {
      NotaDeCredito nota = new NotaDeCredito()
      bindData nota, getObjectToBind()
      Sucursal sucursal = Sucursal.where { nombre == 'OFICINAS'}.find()
      nota.sucursal = sucursal
      nota = notaDeCreditoService.generarBonificacion(nota)
      log.debug('Nota generada: {}', nota)
      respond nota
  }
  */

  @Override
  protected NotaDeCredito saveResource(NotaDeCredito resource) {
    return notaDeCreditoService.save(resource)
  }

  @Override
  protected NotaDeCredito updateResource(NotaDeCredito resource) {
    return notaDeCreditoService.update(resource)
  }

  @Override
  protected NotaDeCredito createResource() {
    log.debug('Prarando Nota de Credito: {}', params)
    NotaDeCredito instance = new NotaDeCredito()
    bindData instance, getObjectToBind()
    log.debug('Nota after binding :{}', instance)
    // if(!instance.sucursal)
    instance.sucursal = notaDeCreditoService.getSucursal()
    return instance
  }

  @Transactional
  def update() {
    if (handleReadOnly()) {
      return
    }

    NotaDeCredito instance = queryForResource(params.id)
    if (instance == null) {
      transactionStatus.setRollbackOnly()
      notFound()
      return
    }

    instance.properties = getObjectToBind()

    instance.validate()
    if (instance.hasErrors()) {
      transactionStatus.setRollbackOnly()
      respond instance.errors, view: 'edit' // STATUS CODE 422
      return
    }

    updateResource instance
    respond instance, [view: 'show', status: OK]
  }


  @Override
  protected List<NotaDeCredito> listAllResources(Map params) {

    params.max = 1000
    params.sort = params.sort ?: 'lastUpdated'
    params.order = params.order ?: 'desc'

    log.debug('Buscando notas: {}', params)

    def query = NotaDeCredito.where {}

    if (params.cartera) {
      String cartera = params.cartera // == 'CON' ? 'COD' : 'CRE'
      query = query.where { tipoCartera == cartera }
    }

    if (params.tipo) {
      String tipo = params.tipo
      query = query.where { tipo == tipo }
    }

    if (params.periodo) {
      def periodo = params.periodo
      query = query.where { fecha >= periodo.fechaInicial && fecha <= periodo.fechaFinal }
    }

    def list = query.list(params)
    return list
  }

  def search() {
    params.max = params.max ?: 10
    def query = NotaDeCredito.where {}

    if (params.term) {
      def search = '%' + params.term + '%'
      if (params.term.isInteger()) {
        // log.debug('Documento: {}', params.term.toInteger())
        query = query.where { folio == params.term.toInteger() }
      } else {
        // log.debug('Cliente nombre like {}', search)
        query = query.where { cliente.nombre =~ search }
      }
    }
    respond query.list(params)
  }

  def buscarRmd() {
    params.max = 1000
    params.sort = params.sort ?: 'lastUpdated'
    params.order = params.order ?: 'desc'
    String cartera = params.cartera
    String clienteId = params.clienteId

    log.info('Buscando RMDs PARAMS: {}', params)

    def rows = []
    if(clienteId) {
      log.debug('Buscando RMDs para cliente: {}', clienteId)
      rows = DevolucionDeVenta.findAll("""
          from DevolucionDeVenta d
          where d.venta.cliente.id = :id
            and d.cobro is null
            and d.cancelado is null
            and d.venta.tipo = :cart
            and d not in(select x.devolucion from NotaDeCredito x)
            order by d.fecha desc""",
        [id: clienteId, cart: cartera])
    } else {
      log.debug('Localizando RMDs DISPONIBLES')
      if(cartera == 'CRE') {
        rows = DevolucionDeVenta.findAll("""
          from DevolucionDeVenta d
          where d.cobro is null
            and d.cancelado is null
            and d.venta.tipo = :cart
            and d not in(select x.devolucion from NotaDeCredito x)
            order by d.fecha desc""",
          [cart: cartera])
      } else {
        rows = DevolucionDeVenta.findAll("""
          from DevolucionDeVenta d
          where d.cobro is not null
            and d.cancelado is null
            and d.venta.tipo != :cart
            and d.cobro not in(select x.cobro from NotaDeCredito x)
            order by d.fecha desc""", [cart: 'CRE'])
      }

    }
    log.debug('RMDs localizados: {}', rows.size())
    respond rows
  }

  def buscarRmdOld() {
    log.debug('Buscar RMDs {}', params)
    params.max = 1000
    params.sort = params.sort ?: 'lastUpdated'
    params.order = params.order ?: 'desc'

    def query = DevolucionDeVenta.where { cancelado == null }

    if (params.cartera != null) {

      def cartera = params.cartera
      query = query.where { venta.tipo == cartera }

      if (params.boolean('pendientes') && cartera == 'CRE') {
        query = query.where { cobro == null }
        // log.debug('Filtrando RMDs pendientes cartera {}', params.cartera)
      } else if (!params.boolean('pendientes') && cartera == 'CRE') {
        query = query.where { cobro != null }
        // log.debug('Filtrando RMDs atendidos cartera {}', params.cartera)
      } else if (params.boolean('pendientes') && cartera != 'CRE') {
        // log.debug('Filtrando RMDs atendidos cartera {}', params.cartera)
        respond buscarRmdsPendientesContado(params)
        return
      }
    }

    if (params.term) {
      // log.debug('Term: {}', params.term)
      if (params.term.isInteger()) {
        query = query.where { documento == params.term.toInteger() }
      } else {
        def search = '%' + params.term + '%'
        query = query.where { venta.cliente.nombre =~ search }
      }
    }

    respond query.list(params)
  }

  def buscarRmdsPendientesContado(params) {
    log.debug('Buscando RMDs de contado pendientes {}', params)
    def hql = " from DevolucionDeVenta d where d.venta.tipo != 'CRE' " +
      "and d.cobro not in (select n.cobro from NotaDeCredito n )"
    if (params.term) {
      if (params.term.isInteger()) {
        Long documento = params.getLong('term')
        hql = hql + " and d.documento = ? "
        def pendientes = DevolucionDeVenta.findAll(hql, [documento])
        return pendientes
      } else {
        def search = '%' + params.term + '%'
        hql = hql + " and d.venta.cliente.nombre like ? "
        def pendientes = DevolucionDeVenta.findAll(hql, search)
        return pendientes
      }
    }
    /*
    if (params.term) {
        hql  = hql + " and d.venta.cliente.nombre like ? "
        def pendientes = DevolucionDeVenta.findAll(hql, [params.term])
        return pendientes
    }
    */
    List pendientes = DevolucionDeVenta.findAll(hql)
    def hql2 = " from DevolucionDeVenta d where d.venta.tipo != 'CRE' and d.cancelado is null " +
      " and d.cobro in (select n.cobro from NotaDeCredito n where n.cfdi is null)"

    def sinTimbrar = DevolucionDeVenta.findAll(hql2)
    pendientes.addAll(sinTimbrar)
    return pendientes

  }

  def buscarFacturasPendientes() {
    log.info('Buscando facturas pendientes: {}', params)
    params.max = 100
    params.sort = params.sort ?: 'lastUpdated'
    params.order = params.order ?: 'asc'
    def cartera = params.cartera ?: 'CRE'

    def cliente = params.cliente
    def facturas = []
    if (params.term) {
      if (params.term.isInteger()) {
        if (cartera == 'CON') {
          facturas = CuentaPorCobrar.findAll(
            "from CuentaPorCobrar c where c.cliente.id = ? and c.tipo in ('COD' , 'CON') and c.documento = ? " +
              " and c.tipoDocumento != 'NOTA_DE_CARGO'",
            [cliente, params.term.toLong()], params)
        } else {
          facturas = CuentaPorCobrar.findAll(
            "from CuentaPorCobrar c where c.cliente.id = ? and c.tipo = ? and c.documento = ? " +
              " and c.tipoDocumento != 'NOTA_DE_CARGO'",
            [cliente, cartera, params.term.toLong()], params)

        }

      }
    } else {
      facturas = CuentaPorCobrar.findAll(
        "from CuentaPorCobrar c " +
          " where c.cliente.id = ? " +
          " and c.tipo = ? " +
          " and c.tipoDocumento != 'NOTA_DE_CARGO'" +
          " and (c.total - c.pagos) > 0",
        [cliente, cartera], params)
    }

    // log.debug('Facturas localizadas: ', facturas.size())
    respond facturas
  }

  def buscarFacturas() {
    params.max = 20
    params.sort = params.sort ?: 'lastUpdated'
    params.order = params.order ?: 'desc'
    def cliente = params.cliente
    def facturas = []
    if (params.term) {
      if (params.term.isInteger()) {
        facturas = CuentaPorCobrar.findAll(
          "from CuentaPorCobrar c where c.cliente.id = ? and c.tipo = ? and c.documento >= ?",
          [cliente, 'CRE', params.term.toLong()], params)
      }
    } else {
      facturas = CuentaPorCobrar.findAll(
        "from CuentaPorCobrar c where c.cliente.id = ? and c.tipo = ? and (c.total - c.pagos) > 0",
        [cliente, 'CRE'], params)
    }

    // log.debug('Facturas localizadas: ', facturas.size())
    respond facturas
  }

  @Transactional
  def generarConRmd(DevolucionDeVenta rmd) {
    log.debug('Generando nota de credito para RMD: {} params: {}', rmd, params)
    NotaDeCredito nota = new NotaDeCredito()
    nota.tipoCartera = params.cartera
    nota = notaDeCreditoService.generarNotaDeDevolucion(nota, rmd)
    respond nota
  }

  def print(NotaDeCredito nota) {
    assert nota.cfdi, 'Nota sin timbrar: ' + nota.id
    def realPath = servletContext.getRealPath("/reports") ?: 'reports'
    def data = NotaPdfGenerator.getReportData(nota)
    Map parametros = data['PARAMETROS']
    parametros.LOGO = realPath + '/PAPEL_CFDI_LOGO.jpg'
    def pdf = reportService.run('PapelCFDI3Nota.jrxml', data['PARAMETROS'], data['CONCEPTOS'])
    render(file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'NotaDeCredito.pdf')
  }


  def solicitarAutorizacion(NotaDeCredito nota) {
    if (nota == null) {
      notFound()
      return
    }
    nota = this.lxAutorizacionService.solicitar(nota)
    respond(nota, view: 'show')
  }

  def timbrar(NotaDeCredito nota) {
    assert !nota.cfdi, 'Nota ya timbrada'
    nota = notaDeCreditoService.timbrar(nota)
    respond(nota, view: 'show')
  }

  def timbrarV4(NotaDeCredito nota) {
    assert !nota.cfdi, 'Nota ya timbrada'
    nota = notaDeCreditoService.timbrarV4(nota)
    respond(nota, view: 'show')
  }

  def cancelar(NotaDeCredito nota) {
    if (nota == null) {
      notFound()
      return
    }
    log.info('Cancelando: {}', params)
    String motivo = params.motivo
    nota = notaDeCreditoService.cancelar(nota, motivo)
    respond(nota, view: 'show')
  }

  def aplicar(NotaDeCredito nota) {
    if (nota == null) {
      notFound()
      return
    }
    log.info('Aplicando nota: {}', nota.folio)
    nota = notaDeCreditoService.aplicar(nota)
    nota.refresh()
    respond(nota, view: 'show')
  }

  def reporteDeNotasDeCredito() {
    // log.debug('Re: {}', params)
    Periodo periodo = new Periodo()
    bindData(periodo, params)
    def repParams = [
      FECHA_INI: periodo.fechaInicial,
      FECHA_FIN: periodo.fechaFinal,
      ORIGEN   : params.ORIGEN,
    ]
    def pdf = reportService.run('NotasDeCredito.jrxml', repParams)
    render(file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'NotasDeCredito.pdf')
  }


  protected void deleteResource(NotaDeCredito nota) {
    notaDeCreditoService.eliminar(nota)
  }

  def handleException(Exception e) {
    String message = ExceptionUtils.getRootCauseMessage(e)
    log.error(message, ExceptionUtils.getRootCause(e))
    respond([message: message], status: 500)
  }


}
