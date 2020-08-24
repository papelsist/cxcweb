package sx.cxc

import groovy.util.logging.Slf4j

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.gorm.transactions.Transactional

import sx.inventario.DevolucionDeVenta

// @GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
@Slf4j
class IntegracionCxcService {

  /**
  * Proceso temporarl para actualiza las notas de credito de Devolucion asignando el RMD correspondiente
  *
  */
  @Transactional
  def actualizarDevoluciones(Date desde) {
    def devoluciones = NotaDeCredito.where{tipo == 'DEVOLUCION' && fecha >= desde && devolucion!= null}
      .list([sord: 'fecha', order: 'asc'])
    devoluciones.each { nota ->
      def cobro = nota.cobro
      if(cobro) {
        def rmd = DevolucionDeVenta.findByCobro(cobro)
        if(rmd) {
            log.debug('Relacionando RMD: {} con nota: {}', rmd.documento, nota.folio)
            nota.devolucion = rmd
		        nota.save flush: true
        } else {
        	log.debug('No localizo el RMD para la nota: {}', nota.id)
        }
      }
    }
  }

}
