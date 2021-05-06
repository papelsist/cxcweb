package sx.core

import grails.events.annotation.gorm.Listener
import groovy.util.logging.Slf4j
import org.grails.datastore.mapping.engine.event.AbstractPersistenceEvent
import org.grails.datastore.mapping.engine.event.PostDeleteEvent
import org.grails.datastore.mapping.engine.event.PostInsertEvent
import org.grails.datastore.mapping.engine.event.PostUpdateEvent
import sx.cloud.LxClienteService


@Slf4j
class ClienteComentarioLogListener implements ReplicaAudit {

  LxClienteService lxClienteService

  @Listener(ClienteComentario)
  void onPostInsertEvent(PostInsertEvent event) {
    logComentario(event, 'INSERT')
    logFirebase(event, 'INSERT')
  }

  @Listener(ClienteComentario)
  void onPostUpdateEvent(PostUpdateEvent event) {
    logComentario(event, 'UPDATE')
    logFirebase(event, 'UPDATE')
  }

  @Listener(ClienteComentario)
  void onPostDeleteEvent(PostDeleteEvent event) {
    logComentario(event, 'DELETE')
    logFirebase(event, 'DELETE')
  }

  void logFirebase(AbstractPersistenceEvent event, String type) {
    ClienteComentario comentario = event.entityObject as ClienteComentario
    Cliente c = Cliente.get(comentario.cliente.id)
    c.refresh()
    log.debug('Actualizando en Firebase: Tipo: {} Cliente: {} ', type, comentario.cliente.id)
    // List validComentarios = c.comentarios.findAll{item -> item != null}
    def comentarios = c.comentarios.collect { item ->
    [
      id: item.id,
      activo: item.activo,
      tipo: item.tipo,
      comentario: item.comentario,
    ]}

    Map changes = ['comentarios': comentarios] as Map
    lxClienteService.update(c, changes)
  }

  void logComentario(AbstractPersistenceEvent event, String type) {
    log.debug('Change detected: {}', type)
    ClienteComentario comentario = event.entityObject as ClienteComentario
    brodcastChanges(comentario.id, 'ClienteComentario', type, 'cliente_comentario')
  }

}
