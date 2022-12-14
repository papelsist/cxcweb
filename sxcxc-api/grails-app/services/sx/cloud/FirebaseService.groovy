package sx.cloud

import com.google.api.core.ApiFuture
import com.google.auth.oauth2.GoogleCredentials
import com.google.cloud.firestore.Firestore
import com.google.cloud.firestore.SetOptions
import com.google.cloud.firestore.WriteResult
import com.google.cloud.storage.BlobId
import com.google.cloud.storage.BlobInfo
import com.google.cloud.storage.Storage
import com.google.cloud.storage.StorageOptions
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.firebase.cloud.FirestoreClient
import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils
import org.springframework.beans.factory.annotation.Value

import grails.util.Environment

import javax.annotation.PostConstruct
import javax.annotation.PreDestroy

@Slf4j
// @CompileDynamic
class FirebaseService {

  static lazyInit = true

  private FirebaseApp app

  @Value('${siipapx.firebase.url:https://siipapx-436ce.firebaseio.com}')
  String firebaseUrl

  @Value('${siipapx.firebase.bucket:siipapx-436ce.appspot.com}')
  String firebaseBucket

  @Value('${siipapx.firebase.projectId:siipapx-436ce}')
  String projectId

  @PreDestroy()
  void cleanup() {
    if(this.app) {
      String appName = this.app.name
      this.app.delete()
      this.app = null
      log.debug('Firebase App {} disconected', appName)
    }
  }

  @PostConstruct()
  void initFirebase() {
    // FileInputStream serviceAccount = new FileInputStream("/Users/rubencancino/Desktop/firebase/siipapx-436ce-firebase-adminsdk-ci4eg-779346f0c5.json");
    // if(Environment.current == Environment.DEVELOPMENT) {
    //   String dir = System.properties['user.home']
    //   FileInputStream serviceAccount = new FileInputStream("${dir}/Desktop/firebase/siipapx-436ce-firebase-adminsdk-ci4eg-779346f0c5.json");
    // }
    log.debug('Inicializando Firebase Url:{} Bucket:{}', this.projectId, this.firebaseBucket)
    FirebaseOptions options = new FirebaseOptions.Builder()
      .setCredentials(GoogleCredentials.getApplicationDefault())
      .setDatabaseUrl(this.firebaseUrl)
      .setStorageBucket(this.firebaseBucket)
      .setProjectId(this.projectId)
      .build();

    app = FirebaseApp.initializeApp(options);
    log.debug('Firebase APP: ', app)
  }

  Firestore getFirestore() {
    if (!this.app) {
      initFirebase()
    }
    return FirestoreClient.getFirestore()
  }


  FirebaseApp getFirebaseApp() {
    return this.app
  }

  void updateCollection(String collection, String id, Map<String, Object> changes) {
    try {
      ApiFuture<WriteResult> result = getFirestore()
        .collection(collection)
        .document(id)
        .set(changes, SetOptions.merge())
      def updateTime = result.get().getUpdateTime().toDate().format('dd/MM/yyyy')
      log.debug('{}/{} UPDATED at : {}', collection, id, updateTime)
    }
    catch (Exception ex) {
      def msg = ExceptionUtils.getRootCauseMessage(ex)
      log.error('Error actualizando {} DocId: {} , Msg: {}', collection, id, msg)
    }
  }

  void updateDocument(String docPath, Map changes) {
    try {
      ApiFuture<WriteResult> result = getFirestore()
        .document(docPath)
        .set(changes, SetOptions.merge())
      def updateTime = result.get()
        .getUpdateTime()
        .toDate()
        .format('dd/MM/yyyy')
      log.debug('{}/{} UPDATED at : {}', collection, id, updateTime)
    }
    catch (Exception ex) {
      def msg = ExceptionUtils.getRootCauseMessage(ex)
      log.error('Error actualizando: {} DocId: {} , Msg: {}', docPath, msg)
    }
  }


  def pushToFireStorage(String objectName, Byte[] data) {
    String projectId = this.projectId //'siipapx-436ce'
    String bucketName = this.firebaseBucket // 'siipapx-436ce.appspot.com'
    Storage storage = StorageOptions.newBuilder().setProjectId(projectId).build().getService()

    BlobId blobId = BlobId.of(bucketName, objectName)
    BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
      .setContentType("application/pdf")
      .setMetadata([size: data.length, uuid: cfdi.uuid, receptorRfc: cfdi.receptorRfc])
      .build()

    storage.create(blobInfo, data)
  }




}


