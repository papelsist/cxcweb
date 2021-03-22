package sx.cloud

import com.google.auth.oauth2.GoogleCredentials
import com.google.cloud.firestore.Firestore
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.UserRecord
import com.google.firebase.cloud.FirestoreClient
import com.google.firebase.database.FirebaseDatabase
import com.google.firebase.messaging.FirebaseMessaging
import com.google.firebase.messaging.Message
import com.google.firebase.messaging.Notification
import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Value

import javax.annotation.PostConstruct
import javax.annotation.PreDestroy

@Slf4j
@CompileStatic
class PapelsaCloudService {

  @Value('${papelsa.firebase.url:https://siipapx-436ce.firebaseio.com}')
  String papelsaFirebaseUrl

  private FirebaseApp papelws

  FirebaseService firebaseService

  @PostConstruct()
  init() {
    /*
    String userHome = System.getProperty('user.home')
    FileInputStream serviceAccount = new FileInputStream(
      "${userHome}/Desktop/firebase/papx-ws-dev-firebase-sdk.json");
    log.debug('Inicializando Firebase Url:{} Bucket:{}', this.papelsaFirebaseUrl)

    FirebaseOptions options = FirebaseOptions.builder()
    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
    .build()
    */
    // this.papelws = FirebaseApp.initializeApp(options, 'papelws')
    // this.papelws = firebaseService.getFirebaseApp()
  }

  Firestore getFirestore() {
    // return FirestoreClient.getFirestore(this.papelws)
    this.firebaseService.getFirestore()
  }

  FirebaseDatabase getFirebaseDatabase() {
    // return FirebaseDatabase.getInstance(this.papelws)
    return FirebaseDatabase.getInstance(firebaseService.getFirebaseApp())

  }

  FirebaseAuth getAuth() {
    // return FirebaseAuth.getInstance(this.papelws)
    return FirebaseAuth.getInstance(firebaseService.getFirebaseApp())
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

  void registerToTopic() {

  }

  @PreDestroy()
  void close() {
    /*
    if(this.papelws) {
      String appName = this.papelws.name
      this.papelws.delete()
      this.papelws = null
      log.debug('Papel firebase ws  {} disconected', appName)
    }
    */
  }
}
