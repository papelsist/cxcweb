package sx.cxc

import grails.plugin.springsecurity.annotation.Secured
import grails.gorm.transactions.Transactional
import grails.rest.*
import groovy.util.logging.Slf4j

import sx.core.LogUser

@Slf4j
@Secured("hasAnyRole('ROLE_ADMIN', 'ROLE_CXC', 'ROLE_CXC_ADMIN', 'ROLE_CXC_CONTADO')")
class AnticipoSatDetController extends RestfulController<AnticipoSatDet> implements LogUser {

  static responseFormats = ['json']

  AplicacionDeAnticipoService aplicacionDeanticipoService

  AnticipoSatDetController() {
    super(AnticipoSatDet)
  }

  @Override
  protected List<AnticipoSatDet> listAllResources(Map params) {
    log.info('List: {}', params)
    params.max = params.max?: 1000
    return super.listAllResources(params)
  }

  def timbrar(AnticipoSatDet aplicacion) {
    log.debug('Timbrando: {}', aplicacion)
    // respond aplicacionDeanticipoService.timbrar(aplicacion)
  }

}



