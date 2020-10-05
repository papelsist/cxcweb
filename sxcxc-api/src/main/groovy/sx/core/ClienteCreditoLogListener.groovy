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

import com.google.api.core.ApiFuture
import com.google.cloud.firestore.*

import sx.cloud.LxClienteService
import sx.cloud.LxClienteCredito

// @CompileStatic
@Slf4j
class ClienteCreditoLogListener implements ReplicaAudit{

  LxClienteService lxClienteService

  @Listener(ClienteCredito)
  void onPreInsertEvent(PreInsertEvent event) {}

  @Listener(ClienteCredito)
  void onPreUpdateEvent(PreUpdateEvent event) {
    preLogClienteCredito(event)
  }

  @Listener(ClienteCredito)
  void onPostUpdateEvent(PostUpdateEvent event) {
    logFirebase(event)
    logCliente(event, 'UPDATE')
  }

  private void logFirebase(AbstractPersistenceEvent event) {
    if (event.entityObject instanceof ClienteCredito) {

      ClienteCredito credito = event.entityObject as ClienteCredito
      Cliente cliente = credito.cliente

      Map changes = ['credito': new LxClienteCredito(credito).toMap()]

      lxClienteService.update(cliente, changes)
    }
  }

  private void preLogClienteCredito(AbstractPersistenceEvent event) {
    if (event.entityObject instanceof ClienteCredito) {
      ClienteCredito credito = event.entityObject as ClienteCredito
      List<String> dirties = credito.dirtyPropertyNames.findAll {it != 'lastUpdated'}

      List criticalProperties = ['postfechado', 'creditoActivo', 'descuentoFijo', 'lineaDeCredito', 'plazo']

      log.debug("ClienteCredito dirty properties: {}", dirties)
      Map changes = [:]
      dirties.each { property ->
        if(criticalProperties.contains(property)) {
          // log.debug('Critical Property detected: {}', property)
          logProperty(property, credito, changes)
        }
      }
      if(changes) {
        changes = changes + ['usuario': credito.updateUser, 'updated': credito.lastUpdated]
        log.debug('Critical changes: {}', changes)
        ApiFuture<DocumentReference> result = lxClienteService
        .firebaseService
        .getFirestore()
        .collection('clientes_critical_log')
        .add(changes)
        def docRef = result.get()
        log.debug("Document  genereated: {}" , docRef.getId())
      }
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

  void logCliente(AbstractPersistenceEvent event, String type) {
    if (event.entityObject instanceof ClienteCredito) {
      ClienteCredito cliente = event.entityObject as ClienteCredito
      brodcastChanges(cliente.id, 'ClienteCredito', type, 'cliente_credito')
    }
  }

}
