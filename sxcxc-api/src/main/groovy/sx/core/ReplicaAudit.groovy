package sx.core

import groovy.util.logging.Slf4j
import sx.audit.Audit

@Slf4j
trait ReplicaAudit {

  List<String> sucursales = [
    'SOLIS',
    'TACUBA',
    'ANDRADE',
    'CALLE 4',
    'CF5FEBRERO',
    'VERTIZ 176',
    'BOLIVAR'
  ]


  def brodcastChanges(String id, String name, String type, String table) {
    log.debug('Publicando en sucursales: Tipo:{}, Id:{}, Tabla:{}', type, id, table)
    Audit.withNewTransaction { session ->
      this.sucursales.each { destino ->
        Audit audit = new Audit(
        persistedObjectId: id,
        name: name,
        source: 'CENTRAL',
        target: destino,
        tableName: table,
        eventName: type)

        audit.save flush: true
      }
    }
  }

}
