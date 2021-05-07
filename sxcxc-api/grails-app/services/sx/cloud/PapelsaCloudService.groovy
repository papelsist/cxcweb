package sx.cloud

import com.google.auth.oauth2.GoogleCredentials
import com.google.cloud.firestore.Firestore
import com.google.cloud.storage.BlobId
import com.google.cloud.storage.BlobInfo
import com.google.cloud.storage.Bucket
import com.google.cloud.storage.Storage
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.UserRecord
import com.google.firebase.cloud.FirestoreClient
import com.google.firebase.cloud.StorageClient
import com.google.firebase.messaging.FirebaseMessaging
import com.google.firebase.messaging.Message
import com.google.firebase.messaging.Notification
import grails.util.Environment
import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils
import sx.cfdi.Cfdi

import javax.annotation.PostConstruct
import javax.annotation.PreDestroy

@Slf4j
@CompileStatic
class PapelsaCloudService {

  private FirebaseApp papelws

  String projectId
  String firebaseBucket

  @PostConstruct()
  init() {
    this.projectId = 'papx-ws-prod'
    this.firebaseBucket = 'papx-ws-prod.appspot.com'
    String dirPath = '.'
    String fileName = 'papx-ws-prod-firebase-sdk.json'
    if(Environment.current == Environment.DEVELOPMENT) {
      this.projectId = 'papx-ws-dev'
      this.firebaseBucket = 'papx-ws-dev.appspot.com'
      dirPath = System.getProperty('user.home') + '/.firebase'
      fileName = 'papx-ws-dev-firebase-sdk.json'
    }
    File file = new File(dirPath, fileName)
    FileInputStream serviceAccount = new FileInputStream(file);


    FirebaseOptions options = FirebaseOptions.builder()
    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
    .build()

    log.debug('PAPELSA Firebase inicializado usando archivo: {}', file.path)

    this.papelws = FirebaseApp.initializeApp(options, 'papelws')
  }

  Firestore getFirestore() {
    return FirestoreClient.getFirestore(this.papelws)
  }

  FirebaseAuth getAuth() {
    return FirebaseAuth.getInstance(this.papelws)
  }

  /**
   * Add new Roles to the user's custom claims. In PapelsaCloud apps
   * roles must start with xpap like xpapCallcenterAdmin
   *
   * @param roles
   * @param email
   */
  void addRoles(Map roles, String email) {
    UserRecord user = this.getAuth().getUserByEmail(email)
    if(user) {
      Map newRoles = user.customClaims + roles
      this.getAuth().setCustomUserClaims(user.uid, newRoles)
    }
  }

  void sendDemoMessage() {
    String topic = "demoData"
    Message message = Message.builder()
    .setNotification(Notification.builder()
    .setTitle('Solicitud autorizada')
    .setBody('Hello world!')
      .build()
    )
    .putData("Solicitud", '48349')
    .putData("Autorizada: ", new Date().format('dd/MM/yyyy hh:mm'))
    .build()

    String response = FirebaseMessaging.getInstance(this.papelws).send(message)
    log.info('Message send:', response)
  }

  /**
   * Uploads a documet to Google cloud storage (Firestorage)
   * @param objectName
   * @param data
   * @param contentType
   * @param metaData
   */
  void uploadDocument(String objectName, byte[] data, String contentType, Map metaData) {
    if(this.papelws == null) {
      this.init()
    }
    log.debug("Publicando documento: {} Data length: {}", objectName, data.length)

    try {
      String projectId = this.projectId
      String bucketName = this.firebaseBucket

      BlobId blobId = BlobId.of(bucketName, objectName)
      BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
        .setContentType(contentType)
        .setMetadata(metaData)
        .build()

      StorageClient storageClient = StorageClient.getInstance(getApp())
      Bucket bucket = storageClient.bucket(this.firebaseBucket)
      Storage storage = bucket.getStorage()
      storage.create(blobInfo, data)
      log.info('Document {} Uploaded to {}', objectName, this.firebaseBucket)
    }catch (Exception ex) {
      log.error('Error subiendo documento ex:' + ExceptionUtils.getRootCauseMessage(ex), ex)
    }
  }

  void uploadPdf(String objectName, byte[] data, Map<String,Object> metaData = [:]) {
    this.uploadDocument(objectName, data, "application/pdf", metaData)
  }

  FirebaseApp getApp() {
    if(this.papelws == null) {
      this.init()
    }
    return this.papelws
  }

  @PreDestroy()
  void close() {
    if(this.papelws) {
      String appName = this.papelws.name
      this.papelws.delete()
      this.papelws = null
      log.debug('Papel firebase ws  {} disconected', appName)
    }
  }
}
