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

/**
 * @deprecated Ya no es util en virtud de que existe una coleccion de concatos
 */
@Deprecated
@CompileStatic
@Slf4j
class ClienteContactosLogListener implements ReplicaAudit {

  LxClienteService lxClienteService

  @Listener(ComunicacionEmpresa)
  void onPostInsertEvent(PostInsertEvent event) {
    logContacto(event, 'INSERT')
    logFirebase(event, 'INSERT')
  }

  @Listener(ComunicacionEmpresa)
  void onPostUpdateEvent(PostUpdateEvent event) {
    logContacto(event, 'UPDATE')
    logFirebase(event, 'UPDATE')
  }

  @Listener(ComunicacionEmpresa)
  void onPostDeleteEvent(PostDeleteEvent event) {
    logContacto(event, 'DELETE')
    logFirebase(event, 'DELETE')
  }

  void logFirebase(AbstractPersistenceEvent event, String type) {
    ComunicacionEmpresa contacto = event.entityObject as ComunicacionEmpresa
    Cliente c = contacto.cliente
    // log.debug('Actualizando en Firebase: Tipo: {} Cliente: {} ', type, contacto.cliente.id)
    List contactos = c.medios.collect{ item -> [
      id: item.id,
      activo: item.activo,
      tipo: item.tipo,
      descripcion: item.descripcion,
      comentario: item.comentario,
      cfdi: item.cfdi,
      validado: item.validado
    ]}
    Map changes = ['medios': contactos] as Map
    lxClienteService.update(c, changes)
  }

  void logContacto(AbstractPersistenceEvent event, String type) {
    log.debug('Change detected: {}', type)
    ComunicacionEmpresa contacto = event.entityObject as ComunicacionEmpresa
    brodcastChanges(contacto.id, 'ComunicacionEmpresa', type, 'comunicacion_empresa')
  }

}
