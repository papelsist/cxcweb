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
class ClienteLogListener {

  @Listener(Cliente)
  void onPreInsertEvent(PreInsertEvent event) {
      logCliente(event)
  }

  @Listener(Cliente)
  void onPreUpdateEvent(PreUpdateEvent event) {
      logCliente(event)
  }

  private void logCliente(AbstractPersistenceEvent event) {
    if (event.entityObject instanceof Cliente) {
      Cliente cte = event.entityObject as Cliente
      def dirties = cte.dirtyPropertyNames
      log.info("Dirty properties: {}", dirties)
      /*
      if (u.password && ((event instanceof  PreInsertEvent) || (event instanceof PreUpdateEvent && u.isDirty('password')))) {
          event.getEntityAccess().setProperty('password', encodePassword(u.password))
      }
      */
    }
  }

}
