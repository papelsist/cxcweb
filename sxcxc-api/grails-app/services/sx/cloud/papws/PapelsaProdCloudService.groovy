package sx.cloud.papws

import com.google.api.core.ApiFuture
import com.google.cloud.firestore.DocumentReference
import com.google.cloud.firestore.DocumentSnapshot
import com.google.cloud.firestore.WriteResult
import groovy.util.logging.Slf4j


import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.firebase.cloud.FirestoreClient
import com.google.cloud.firestore.Firestore
import sx.cloud.PapelsaCloudService


@Slf4j
class PapelsaProdCloudService {

  FirebaseApp productionApp
  PapelsaCloudService papelsaCloudService

  def init() {

    String dirPath = System.getProperty('user.home') + '/.firebase'
    String fileName = 'papx-ws-prod-firebase-sdk.json'
    File file = new File(dirPath, fileName)

    FileInputStream serviceAccount = new FileInputStream(file);
    log.debug('Inicializando Firebase services para PapelWS (PRODUCCION)' )

    FirebaseOptions options = FirebaseOptions.builder()
      .setCredentials(GoogleCredentials.fromStream(serviceAccount))
      .build()

    this.productionApp = FirebaseApp.initializeApp(options, 'productionApp')
  }

  Firestore getFirestore() {
    return FirestoreClient.getFirestore(getApp())
  }

  FirebaseApp getApp() {
    if(!this.productionApp) {
      this.init()
    }
    return this.productionApp
  }

  void close() {
    if(this.productionApp) {
      String appName = this.productionApp.name
      this.productionApp.delete()
      this.productionApp = null
      log.debug('Papel firebase ws  {} disconected', appName)
    }
  }

  void importarSolicitudesAutorizadas() {
    Iterable<DocumentReference> documents = this.papelsaCloudService
      .getFirestore()
      .collection('solicitudes')
      .listDocuments()
    log.info('Documentos: {}', documents.size())

    documents.each {
      DocumentSnapshot snapshot = it.get().get()
      if(snapshot.exists()) {
        String id = snapshot.getId()
        Map<String, Object> data = snapshot.getData()
        data.appVersion = 1
        if(data.autorizacion) {
          log.info('Exportar a produccion')
          log.info('Payload: {}', data)
          DocumentReference targetDocRef = this.getFirestore().collection('solicitudes').document(id)
          def snap = targetDocRef.get().get()
          if(!snap.exists()) {
            targetDocRef.set(data).get()
          }
        }
      }
    }
  }
}
