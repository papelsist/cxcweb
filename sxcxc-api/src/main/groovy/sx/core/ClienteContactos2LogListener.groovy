package sx.core

import groovy.util.logging.Slf4j
import groovy.transform.CompileStatic

import org.springframework.beans.factory.annotation.Autowired

import grails.events.annotation.Subscriber
import grails.events.annotation.gorm.Listener

import org.grails.datastore.mapping.engine.event.AbstractPersistenceEvent
import org.grails.datastore.mapping.engine.event.PostUpdateEvent
import org.grails.datastore.mapping.engine.event.PostInsertEvent
import org.grails.datastore.mapping.engine.event.PostDeleteEvent

import sx.cloud.LxClienteService

@CompileStatic
@Slf4j
class ClienteContactos2LogListener implements ReplicaAudit {

  LxClienteService lxClienteService

  @Listener(ClienteContacto)
  void onPostInsertEvent(PostInsertEvent event) {
    logContacto(event, 'INSERT')
    logFirebase(event, 'INSERT')
  }

  @Listener(ClienteContacto)
  void onPostUpdateEvent(PostUpdateEvent event) {
    logContacto(event, 'UPDATE')
    logFirebase(event, 'UPDATE')
  }

  @Listener(ClienteContacto)
  void onPostDeleteEvent(PostDeleteEvent event) {
    logContacto(event, 'DELETE')
    logFirebase(event, 'DELETE')
  }

  void logFirebase(AbstractPersistenceEvent event, String type) {
    ClienteContacto contacto = event.entityObject as ClienteContacto
    Cliente c = contacto.cliente
    // log.debug('Actualizando en Firebase: Tipo: {} Cliente: {} ', type, contacto.cliente.id)
    List contactos = c.contactos.collect{ item -> [
      id: item.id,
      nombre: item.nombre,
      puesto: item.puesto,
      telefono: item.telefono,
      email: item.email,
    ]}
    Map changes = ['contactos': contactos] as Map
    lxClienteService.update(c, changes)
  }

  void logContacto(AbstractPersistenceEvent event, String type) {
    log.debug('Change detected: {}', type)
    ClienteContacto contacto = event.entityObject as ClienteContacto
    brodcastChanges(contacto.id, 'ClienteContacto', type, 'cliente_contacto')
  }

}
