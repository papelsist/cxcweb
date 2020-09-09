package sx.core

import groovy.util.logging.Slf4j

import grails.rest.RestfulController
import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured

import org.apache.commons.lang3.exception.ExceptionUtils


@Slf4j
@GrailsCompileStatic
@Secured("hasAnyRole('ROLE_ADMIN', 'ROLE_CXC', 'ROLE_CXC_ADMIN')")
class ClienteCreditoController extends RestfulController<ClienteCredito> {

	ClienteCreditoService clienteCreditoService

  ClienteCreditoController(){
      super(ClienteCredito)
  }

  @Override
  protected ClienteCredito updateResource(ClienteCredito resource) {
    log.debug('Actualizando {}', resource)
    return clienteCreditoService.updateCliente(resource)
  }

  def handleException(Exception e) {
    String message = ExceptionUtils.getRootCauseMessage(e)
    log.error(message, ExceptionUtils.getRootCause(e))
    respond([message: message], status: 500)
  }
}
