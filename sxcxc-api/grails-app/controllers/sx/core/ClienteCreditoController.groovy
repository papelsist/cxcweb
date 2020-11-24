package sx.core

import groovy.util.logging.Slf4j

import grails.rest.RestfulController
import grails.compiler.GrailsCompileStatic
import groovy.transform.TypeCheckingMode
import grails.plugin.springsecurity.annotation.Secured
import grails.gorm.transactions.Transactional

import org.apache.commons.lang3.exception.ExceptionUtils


@Slf4j
// @GrailsCompileStatic
@Secured("hasAnyRole('ROLE_ADMIN', 'ROLE_CXC', 'ROLE_CXC_ADMIN')")
class ClienteCreditoController extends RestfulController<ClienteCredito> {

	ClienteCreditoService clienteCreditoService

  ClienteCreditoController(){
      super(ClienteCredito)
  }

  // @GrailsCompileStatic(TypeCheckingMode.SKIP)
  @Transactional
  @Override
  def save() {
    Cliente cliente = Cliente.get(params.clienteId)
    log.info('Alta de credito para: {}', cliente.nombre)
    ClienteCredito credito = new ClienteCredito()
    cliente.credito = credito
    cliente = cliente.save failOnError: true, flush:true
    // def instance = new ClienteCredito()

    // instance.validate()
    // if (instance.hasErrors()) {
    //       transactionStatus.setRollbackOnly()
    //       respond instance.errors, view:'create' // STATUS CODE 422
    //       return
    // }
    // saveResource instance
    redirect(controller: 'cliente', action: 'show', id: cliente.id)
  }


  @Override
  protected ClienteCredito updateResource(ClienteCredito resource) {
    log.debug('Actualizando {}', resource)
    return clienteCreditoService.updateCliente(resource)
  }

  // @Override
  // protected ClienteCredito createResource(ClienteCredito resource) {
  //   log.debug('Actualizando {}', resource)
  //   return clienteCreditoService.updateCliente(resource)
  // }



  def handleException(Exception e) {
    String message = ExceptionUtils.getRootCauseMessage(e)
    log.error(message, ExceptionUtils.getRootCause(e))
    respond([message: message], status: 500)
  }
}
