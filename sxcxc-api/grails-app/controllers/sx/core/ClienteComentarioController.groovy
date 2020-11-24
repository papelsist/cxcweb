package sx.core

import groovy.util.logging.Slf4j
import groovy.transform.TypeCheckingMode

import grails.rest.RestfulController
import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.gorm.transactions.Transactional

import org.apache.commons.lang3.exception.ExceptionUtils


@Slf4j
// @GrailsCompileStatic
@Secured("hasAnyRole('ROLE_ADMIN', 'ROLE_CXC', 'ROLE_CXC_ADMIN')")
class ClienteComentarioController extends RestfulController<ClienteComentario> {

	ClienteComentarioService clienteComentarioService

  ClienteComentarioController(){
    super(ClienteComentario)
  }

  @Override
  protected ClienteComentario saveResource(ClienteComentario resource) {
    log.debug('Salvando comentario: {}', resource)
    return clienteComentarioService.save(resource)
  }

  // @Override
  // protected void deleteResource(ClienteComentario resource) {
  //   Cliente cliente = Cliente.get(params.clienteId)
  //   cliente.removeFromComentarios(resource)
  //   cliente.save flush: true
  // }

  @Override
  protected ClienteComentario updateResource(ClienteComentario resource) {
    log.debug('Actualizando comentario: {}', resource)
    return clienteComentarioService.updateMedio(resource)
  }

  @GrailsCompileStatic(TypeCheckingMode.SKIP)
  def handleException(Exception e) {
    String message = ExceptionUtils.getRootCauseMessage(e)
    // log.error(message, ExceptionUtils.getRootCause(e))
    log.error(message, e)
    respond([message: message], status: 500)
  }
}
