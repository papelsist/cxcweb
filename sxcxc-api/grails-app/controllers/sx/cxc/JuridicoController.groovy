package sx.cxc

import grails.plugin.springsecurity.annotation.Secured
import grails.gorm.transactions.Transactional
import grails.rest.*
import groovy.util.logging.Slf4j

import sx.core.LogUser

@Slf4j
@Secured("hasAnyRole('ROLE_ADMIN', 'ROLE_CXC', 'ROLE_CXC_ADMIN')")
class JuridicoController extends RestfulController<Juridico> implements LogUser {

    static responseFormats = ['json']

    JuridicoController() {
        super(Juridico)
    }

    @Override
    protected List<Juridico> listAllResources(Map params) {
        log.info('List: {}', params)
        params.max = params.max?: 1000
        return super.listAllResources(params)
    }

    /*
    @Override
    protected Juridico createResource() {
      log.debug('Creando entidad Juridico params: ', params)
        Juridico juridico = new Juridico()
        bindData juridico, getObjectToBind()
        CuentaPorCobrar cxc = juridico.cxc
        juridico.saldo = cxc.saldo
        juridico.importe = cxc.total
        juridico.nombre = cxc.cliente.nombre
        juridico.traspaso = command.traspaso
        juridico.comentario = command.comentario
        juridico.abogado = command.abogado
        juridico.despacho = command.despacho

        log.debug('Jur: {}', juridico)
        return juridico
    }
    */

    @Override
    protected Juridico saveResource(Juridico resource) {
      log.info('Salvando juridico: {}', resource)
      CuentaPorCobrar cxc = resource.cxc
      cxc.juridico = resource.traspaso
      cxc.save()
      logEntity(cxc)
      logEntity(resource)
      resource.save failOnError: true, flush: true
    }

    @Transactional
    def mandarFacturas(MandarJuridicoCommand command) {
        if(command == null) {
            notFound()
            return
        }
        log.info('Juridico: {}', command)
        List<Juridico> rows = []
        command.facturas.each { cxc ->
            Juridico juridico = new Juridico()
            juridico.cxc = cxc
            juridico.saldo = cxc.saldo
            juridico.importe = cxc.total
            juridico.nombre = cxc.cliente.nombre
            juridico.traspaso = command.traspaso
            juridico.comentario = command.comentario
            juridico.abogado = command.abogado
            juridico.despacho = command.despacho
            juridico.save failOnError: true, flush: true
            cxc.juridico = juridico.traspaso
            cxc.save flush: true
            rows << juridico
        }
        respond rows
    }
}


class MandarJuridicoCommand {
    DespachoDeCobranza despacho
    String abogado
    String comentario
    List<CuentaPorCobrar> facturas
    Date traspaso

    static constraints = {
        comentario nullable: true
    }

    String toString() {
        "${this.facturas.size()} Facturas para al despacho: ${this.despacho}  Fecha: ${traspaso.format('dd/MM/yyyy')}"
    }
}
