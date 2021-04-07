package sx.cloud.papws

import java.text.SimpleDateFormat

import groovy.util.logging.Slf4j

import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional

import com.google.api.core.ApiFuture
import com.google.cloud.firestore.*
import static com.google.cloud.firestore.DocumentChange.Type.*

import org.apache.commons.lang3.exception.ExceptionUtils

import sx.cloud.PapelsaCloudService
import sx.cxc.SolicitudDeDeposito


@Slf4j
// @GrailsCompileStatic
@Transactional
class ExportadorDeSolicitudesService {

  PapelsaCloudService papelsaCloudService

  private String COLLECTION = 'solicitudes'

  void pushToFirestore(String documentId, Map data) {

    ApiFuture<WriteResult> res = this.papelsaCloudService.getFirestore()
      .collection(this.COLLECTION)
      .document(documentId)
      .set(data, SetOptions.merge())
    log.info('Published: {}' , res.get().updateTime)
  }

  void pushSolicitud(SolicitudDeDeposito sol) {
    Map<String, Object> data = sol.toFirebase()
    this.pushToFirestore(sol.id, data)
  }

  void sincronizar(Date dia = new Date()) {
    def pendientes = exportarPendientes(dia)

    def autorizadas = exportarAutorizadas(dia)

    def rechazadas = exportarRechazados(dia)

    log.info('Solicitudes exportadas a firestore Pendientes: {} Autorizadas: {}  Rechazads: {rechazadas}' , pendientes, autorizadas, rechazadas)

  }

  List<SolicitudDeDeposito> fetchPendientes(Date dia) {
    return SolicitudDeDeposito
	    .findAll("""
        from SolicitudDeDeposito s
         where s.fecha = :fecha
           and s.cobro is null
           and s.tipo = 'NORMAL'
           and s.id not in (select x.entityId from ReplicacionFirebaseLog x where x.tipo = 'PENDIENTE')
        """,
      [fecha: dia],
      [max: 100])
  }

  List<SolicitudDeDeposito> fetchAutorizados(Date dia) {
     return SolicitudDeDeposito
	    .findAll("""
        from SolicitudDeDeposito s
         where s.fecha = :fecha
           and s.cobro is not null
           and s.tipo = 'NORMAL'
           and s.id not in (select x.entityId from ReplicacionFirebaseLog x where x.tipo = 'AUTORIZADO')
        """,
      [fecha: dia],
      [max: 1000])
  }

  List<SolicitudDeDeposito> fetchRechazados(Date dia) {
    return SolicitudDeDeposito
	    .findAll("""
        from SolicitudDeDeposito s
         where s.fecha = :fecha
           and s.cobro is null
           and s.tipo = 'NORMAL'
           and s.comentario is not null
           and s.id not in (select x.entityId from ReplicacionFirebaseLog x where x.tipo = 'RECHAZADO')
        """,
      [fecha: dia],
      [max: 40])
  }

  int exportarPendientes(Date dia = new Date()) {
    List<SolicitudDeDeposito> pendientes = fetchPendientes(dia)
    int count = 0;
    pendientes.each { sol ->
      try {
        exportarSolicitudPendiente(sol)
        count++;
      }catch (Exception ex) {
        String msg = ExceptionUtils.getRootCauseMessage(ex)
        log.error(msg, ex)
      }
    }
    return count
  }

  int exportarAutorizadas(Date dia = new Date()) {
    List<SolicitudDeDeposito> autorizadas = fetchAutorizados(dia)
    int count = 0;
    autorizadas.each { sol ->
      try {
        exportarSolicitudAutorizada(sol)
        count++;
      }catch (Exception ex) {
        String msg = ExceptionUtils.getRootCauseMessage(ex)
        log.error(msg, ex)
      }
    }
    return count
  }

  int exportarRechazados(Date dia = new Date()) {
    List<SolicitudDeDeposito> rechazados = fetchRechazados(dia)
    int count = 0;
    rechazados.each { sol ->
      try {
        exportarSolicitudRechazada(sol)
        count++;
      }catch (Exception ex) {
        String msg = ExceptionUtils.getRootCauseMessage(ex)
        log.error(msg, ex)
      }
    }
    return count
  }

  void exportarSolicitudPendiente(SolicitudDeDeposito sol) {
    this.pushSolicitud(sol)
    ReplicacionFirebaseLog log = new ReplicacionFirebaseLog()
    log.entity = 'SolicitudDeDeposito'
    log.entityId = sol.id
    log.tipo = 'PENDIENTE'
    log.replicado = new Date()
    log.save flush: true
  }

  void exportarSolicitudAutorizada(SolicitudDeDeposito sol) {
    Map<String, Object> data = sol.toFirebase()
    data.autorizacion = [
      fecha: sol.cobro.dateCreated,
      createUser: 'tesoreria',
      uid: 'tesoreria',
      comentario: 'IMPORTADO DE SIIPAPX',
      replicado: new Date()
    ]
    data.cobro = sol.cobro.id
    pushToFirestore(sol.id, data)
    ReplicacionFirebaseLog log = new ReplicacionFirebaseLog()
    log.entity = 'SolicitudDeDeposito'
    log.entityId = sol.id
    log.tipo = 'AUTORIZADO'
    log.replicado = new Date()
    log.save flush: true
  }

  void exportarSolicitudRechazada(SolicitudDeDeposito sol) {
    Map<String, Object> data = sol.toFirebase()
    data.status = 'RECHAZADO'
    data.rechazo = [
      uid: 'tesoreria',
      userName: 'tesoreria',
      motivo: 'CHECAR_DATOS',
      comentario: sol.comentario,
      dateCreated: sol.lastUpdated,
      replicado: new Date()
    ]
    pushToFirestore(sol.id, data)
    ReplicacionFirebaseLog log = new ReplicacionFirebaseLog()
    log.entity = 'SolicitudDeDeposito'
    log.entityId = sol.id
    log.tipo = 'RECHAZADO'
    log.replicado = new Date()
    log.save flush: true
  }

}
