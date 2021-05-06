package sx.core

import com.google.api.core.ApiFuture
import com.google.cloud.firestore.DocumentReference
import grails.events.annotation.gorm.Listener
import groovy.util.logging.Slf4j
import org.grails.datastore.mapping.engine.event.*
import sx.cloud.LxClienteCredito
import sx.cloud.LxClienteService

@Slf4j
class ClienteCreditoLogListener implements ReplicaAudit{

  LxClienteService lxClienteService

  @Listener(ClienteCredito)
  void onPreInsertEvent(PreInsertEvent event) {}

  @Listener(ClienteCredito)
  void onPostInsertEvent(PostInsertEvent event) {
    logFirebase(event)
    logCliente(event, 'INSERT')
  }

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

      List criticalProperties = ['postfechado', 'creditoActivo', 'descuentoFijo', 'lineaDeCredito', 'plazo', 'atrasoMaximo']

      log.debug("ClienteCredito dirty properties: {}", dirties)
      Map<String,Object> changes = [:]
      dirties.each { property ->
        if(criticalProperties.contains(property)) {
          logProperty(property, credito, changes)
        }
      }
      if(changes) {
        String clienteId = credito.cliente.id
        changes.clienteId = clienteId
        changes.cliente = credito.cliente.nombre
        changes = changes + ['usuario': credito.updateUser, 'updated': credito.lastUpdated]
        this.lxClienteService.updateCriticalProperties(clienteId, changes)
        /*
        log.debug('Critical changes: {}', changes)
        ApiFuture<DocumentReference> result = lxClienteService
        .firebaseService
        .getFirestore()
        .collection('clientes_critical_log')
        .add(changes)
        def docRef = result.get()
        log.debug("Document  genereated: {}" , docRef.getId())
         */
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
