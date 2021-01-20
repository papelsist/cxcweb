package sx.cxc

import grails.plugin.springsecurity.annotation.Secured
import grails.gorm.transactions.Transactional
import grails.rest.*
import groovy.util.logging.Slf4j

import sx.core.LogUser

@Slf4j
@Secured("hasAnyRole('ROLE_ADMIN', 'ROLE_CXC', 'ROLE_CXC_ADMIN', 'ROLE_CXC_CONTADO')")
class AnticipoSatController extends RestfulController<AnticipoSat> implements LogUser {

  static responseFormats = ['json']

  AnticipoSatController() {
    super(AnticipoSat)
  }

  @Override
  protected List<AnticipoSat> listAllResources(Map params) {
    log.info('List: {}', params)
    params.max = params.max?: 1000
    return super.listAllResources(params)
  }

}



