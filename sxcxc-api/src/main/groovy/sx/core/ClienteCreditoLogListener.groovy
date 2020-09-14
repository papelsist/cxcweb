package sx.core

import groovy.util.logging.Slf4j

import org.grails.datastore.mapping.engine.event.AbstractPersistenceEvent
import org.grails.datastore.mapping.engine.event.PreInsertEvent
import org.grails.datastore.mapping.engine.event.PreUpdateEvent
import org.springframework.beans.factory.annotation.Autowired
import grails.events.annotation.gorm.Listener
import groovy.transform.CompileStatic

// @CompileStatic
@Slf4j
class ClienteCreditoLogListener {

  @Listener(ClienteCredito)
  void onPreInsertEvent(PreInsertEvent event) {
      logClienteCredito(event)
  }

  @Listener(ClienteCredito)
  void onPreUpdateEvent(PreUpdateEvent event) {
      logClienteCredito(event)
  }

  private void logClienteCredito(AbstractPersistenceEvent event) {
    if (event.entityObject instanceof ClienteCredito) {
      ClienteCredito credito = event.entityObject as ClienteCredito
      List<String> dirties = credito.dirtyPropertyNames.collect {it != 'lastUpdated'}
      log.info("ClienteCredito dirty properties: {}", dirties)
      Map changes = [:]
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
