package sx.cxc

import groovy.util.logging.Slf4j

import grails.compiler.GrailsCompileStatic
import grails.rest.RestfulController
import grails.plugin.springsecurity.annotation.Secured
import grails.gorm.transactions.Transactional

import org.apache.commons.lang3.exception.ExceptionUtils

import sx.cxc.AntiguedadService

@GrailsCompileStatic
@Slf4j
@Secured("hasAnyRole('ROLE_ADMIN', 'ROLE_CXC', 'ROLE_CXC_ADMIN', 'ROLE_BI')")
@Transactional(readOnly = true)
class AntiguedadController {

  AntiguedadService antiguedadService

  AntiguedadController() {}

  def index(AntiguedadCommand command) {
    log.info('Fetch Antiguedad: {}', command)
    List<AntiguedadPorCliente> data = AntiguedadPorCliente.where{fecha == command.fecha}.list()
    respond data
  }

  @Transactional()
  def generar(AntiguedadCommand command) {
    log.info('Generando Antiguedad: {}', command)
    respond antiguedadService.generar(command.cartera, command.fecha)
  }

  def handleException(Exception e) {
    String message = ExceptionUtils.getRootCauseMessage(e)
    log.error(message, ExceptionUtils.getRootCause(e))
    respond([message: message], status: 500)
  }

}

class AntiguedadCommand {
  String cartera
  Date fecha

  String toString() {
    return "${fecha?.format('dd/MM/yyyy')} (${cartera})"
  }
}
