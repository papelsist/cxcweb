package sx.core

import groovy.util.logging.Slf4j

import grails.events.annotation.Subscriber
import grails.gorm.transactions.Transactional

import grails.util.Environment

import sx.cloud.FirebaseService
import sx.core.LogUser

@Transactional
@Slf4j
class MedioDeContactoService implements LogUser {

  FirebaseService firebaseService

  ComunicacionEmpresa updateMedio(ComunicacionEmpresa medio) {
    ComunicacionEmpresa target = medio.save failOnError: true, flush: true
    // updateFirebase(target)
    logEntity(target)
    return target
  }

  void updateFirebase(ComunicacionEmpresa medio) {

  }

}
