package sx.core

import groovy.util.logging.Slf4j

import grails.events.annotation.Subscriber
import grails.gorm.transactions.Transactional

import grails.util.Environment


import sx.core.LogUser

@Transactional
@Slf4j
class MedioDeContactoService implements LogUser {


  ComunicacionEmpresa save(ComunicacionEmpresa medio) {
    ComunicacionEmpresa target = medio.save failOnError: true, flush: true
    log.debug('Medio de contacto registrado {}', target);
    logEntity(target)
    return target
  }

  ComunicacionEmpresa updateMedio(ComunicacionEmpresa medio) {
    ComunicacionEmpresa target = medio.save failOnError: true, flush: true
    // updateFirebase(target)
    log.debug('Medio de contacto actualizado {}', target);
    logEntity(target)
    return target
  }



}
