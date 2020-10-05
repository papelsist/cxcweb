package sx.core

import groovy.util.logging.Slf4j
import groovy.transform.TypeCheckingMode

import grails.rest.RestfulController
import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured

import org.apache.commons.lang3.exception.ExceptionUtils


@Slf4j
@GrailsCompileStatic
@Secured("hasAnyRole('ROLE_ADMIN', 'ROLE_CXC', 'ROLE_CXC_ADMIN')")
class MedioDeContactoController extends RestfulController<ComunicacionEmpresa> {

	MedioDeContactoService medioDeContactoService

  MedioDeContactoController(){
    super(ComunicacionEmpresa)
  }

  @Override
  protected ComunicacionEmpresa saveResource(ComunicacionEmpresa resource) {
    log.debug('Salvando medio de contacto: {}', resource)
    return medioDeContactoService.save(resource)
  }

  @Override
  protected ComunicacionEmpresa updateResource(ComunicacionEmpresa resource) {
    log.debug('Actualizando {}', resource)
    return medioDeContactoService.updateMedio(resource)
  }

  @GrailsCompileStatic(TypeCheckingMode.SKIP)
  def handleException(Exception e) {
    String message = ExceptionUtils.getRootCauseMessage(e)
    log.error(message, ExceptionUtils.getRootCause(e))
    respond([message: message], status: 500)
  }
}
