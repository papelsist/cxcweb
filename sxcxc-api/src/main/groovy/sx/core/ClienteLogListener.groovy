package sx.core

import grails.events.annotation.gorm.Listener
import groovy.util.logging.Slf4j
import org.grails.datastore.mapping.engine.event.AbstractPersistenceEvent
import org.grails.datastore.mapping.engine.event.PostUpdateEvent
import org.grails.datastore.mapping.engine.event.PreInsertEvent
import org.grails.datastore.mapping.engine.event.PreUpdateEvent
import sx.cloud.LxClienteService

@Slf4j
class ClienteLogListener implements ReplicaAudit{

  LxClienteService lxClienteService

  @Listener(Cliente)
  void onPreInsertEvent(PreInsertEvent event) {
    preLogCliente(event)
  }

  @Listener(Cliente)
  void onPreUpdateEvent(PreUpdateEvent event) {
    preLogCliente(event)
  }

  @Listener(Cliente)
  void onPostUpdateEvent(PostUpdateEvent event) {
    logFirebase(event)
    logCliente(event, 'UPDATE')
  }

  private void logFirebase(AbstractPersistenceEvent event) {
    if (event.entityObject instanceof Cliente) {
      Cliente cliente = event.entityObject as Cliente
      lxClienteService.update(cliente)
    }
  }

  private void preLogCliente(AbstractPersistenceEvent event) {
    if (event.entityObject instanceof Cliente) {
      Cliente cte = event.entityObject as Cliente
      def dirties = cte.dirtyPropertyNames
      log.debug("Dirty properties: {}", dirties)
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

  void logCliente(AbstractPersistenceEvent event, String type) {
    if (event.entityObject instanceof Cliente) {
      Cliente cliente = event.entityObject as Cliente
      brodcastChanges(cliente.id, 'Cliente', type, 'cliente')
    }
  }


}
