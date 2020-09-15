package sx.core

import groovy.util.logging.Slf4j
import groovy.transform.CompileStatic

import org.springframework.beans.factory.annotation.Autowired

import grails.events.annotation.gorm.Listener
import org.grails.datastore.mapping.engine.event.AbstractPersistenceEvent
import org.grails.datastore.mapping.engine.event.PreInsertEvent
import org.grails.datastore.mapping.engine.event.PreUpdateEvent
import org.grails.datastore.mapping.engine.event.PostUpdateEvent
import org.grails.datastore.mapping.engine.event.PostInsertEvent


import sx.cloud.LxClienteCreditoService

// @CompileStatic
@Slf4j
class ClienteCreditoLogListener {

  LxClienteCreditoService lxClienteCreditoService

  @Listener(ClienteCredito)
  void onPreInsertEvent(PreInsertEvent event) {
    logClienteCredito(event)
  }

  @Listener(ClienteCredito)
  void onPreUpdateEvent(PreUpdateEvent event) {
    logClienteCredito(event)
  }

  @Listener(ClienteCredito)
  void onPostUpdateEvent(PostUpdateEvent event) {
    logFirebase(event)
  }

  private void logFirebase(AbstractPersistenceEvent event) {
    if (event.entityObject instanceof ClienteCredito) {
      ClienteCredito credito = event.entityObject as ClienteCredito
      log.info('Cliente credito updated: ', credito.id)
      log.info('Updating Firebase....')
      lxClienteCreditoService.update(credito)
    }
  }

  private void logClienteCredito(AbstractPersistenceEvent event) {
    if (event.entityObject instanceof ClienteCredito) {
      ClienteCredito credito = event.entityObject as ClienteCredito
      List<String> dirties = credito.dirtyPropertyNames.findAll {it != 'lastUpdated'}

      log.info("ClienteCredito dirty properties: {}", dirties)
      Map changes = ['user': credito.updateUser, 'updated': credito.lastUpdated]
      dirties.each { property ->
        logProperty(property, credito, changes)
      }
      log.info('Changes: {}', changes)
    }
  }

  void logProperty(String property, ClienteCredito b, Map<String, Map<String,Object>> changes) {
    if(b.isDirty(property)) {
      def current = b[property]
      def original = b.getPersistentValue(property)
      if (current != original) {
        changes.put(property, ['original': original, 'curent': current])
      }
    }
  }



}
