package sx.core

import groovy.util.logging.Slf4j

import org.grails.datastore.mapping.engine.event.AbstractPersistenceEvent
import org.grails.datastore.mapping.engine.event.PreInsertEvent
import org.grails.datastore.mapping.engine.event.PreUpdateEvent
import org.grails.datastore.mapping.engine.event.PostUpdateEvent
import org.grails.datastore.mapping.engine.event.PostInsertEvent
import org.springframework.beans.factory.annotation.Autowired
import grails.events.annotation.gorm.Listener
import groovy.transform.CompileStatic

import sx.cloud.LxClienteService

// @CompileStatic
@Slf4j
class ClienteLogListener {

  LxClienteService lxClienteService

  @Listener(Cliente)
  void onPreInsertEvent(PreInsertEvent event) {
    logCliente(event)
  }

  @Listener(Cliente)
  void onPreUpdateEvent(PreUpdateEvent event) {
    logCliente(event)
  }

  @Listener(Cliente)
  void onPostUpdateEvent(PostUpdateEvent event) {
    logFirebase(event)
  }

  private void logFirebase(AbstractPersistenceEvent event) {
    if (event.entityObject instanceof Cliente) {
      Cliente cliente = event.entityObject as Cliente
      lxClienteService.update(cliente)
    }
  }

  private void logCliente(AbstractPersistenceEvent event) {
    if (event.entityObject instanceof Cliente) {
      Cliente cte = event.entityObject as Cliente
      def dirties = cte.dirtyPropertyNames
      log.info("Dirty properties: {}", dirties)
      if(cte.isDirty('email')) {
        def cfdiMail = cte.medios.find{ it.tipo == 'MAIL' && it.cfdi}
        if(cfdiMail) {
          cfdiMail.descripcion = cte.email
        }
      }
      /*
      if (u.password && ((event instanceof  PreInsertEvent) || (event instanceof PreUpdateEvent && u.isDirty('password')))) {
          event.getEntityAccess().setProperty('password', encodePassword(u.password))
      }
      */
    }
  }

}
