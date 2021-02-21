package sx.cloud

import com.google.auth.oauth2.GoogleCredentials
import com.google.cloud.firestore.Firestore
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.cloud.FirestoreClient
import com.google.firebase.database.FirebaseDatabase
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

  @PostConstruct()
  init() {
    String userHome = System.getProperty('user.home')
    FileInputStream serviceAccount = new FileInputStream(
      "${userHome}/Desktop/firebase/papx-ws-dev-firebase-sdk.json");
    log.debug('Inicializando Firebase Url:{} Bucket:{}', this.papelsaFirebaseUrl)

    FirebaseOptions options = FirebaseOptions.builder()
    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
    .build()

    this.papelws = FirebaseApp.initializeApp(options, 'papelws')
  }

  Firestore getFirestore() {
    return FirestoreClient.getFirestore(this.papelws)
  }

  FirebaseDatabase getFirebaseDatabase() {
    return FirebaseDatabase.getInstance(this.papelws)
  }

  FirebaseAuth getAuth() {
    return FirebaseAuth.getInstance(this.papelws)
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
