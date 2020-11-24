package sx.core

import groovy.util.logging.Slf4j

import grails.events.annotation.Subscriber
import grails.gorm.transactions.Transactional

import grails.util.Environment


import sx.core.LogUser

@Transactional
@Slf4j
class ClienteComentarioService implements LogUser {

  ClienteComentario save(ClienteComentario comentario) {
    ClienteComentario target = comentario.save failOnError: true, flush: true
    log.debug('Comentario registrado: {} id: {}', target, target.id);
    logEntity(target)
    return target
  }

  ClienteComentario updateMedio(ClienteComentario comentario) {
    ClienteComentario target = comentario.save failOnError: true, flush: true
    log.debug('Comentario actualizado: {}', target);
    logEntity(target)
    return target
  }



}
