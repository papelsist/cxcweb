package sx.cloud

import groovy.util.logging.Slf4j

import javax.annotation.PostConstruct
import javax.annotation.PreDestroy

@Slf4j
class FirebaseMessageService {
  static lazyInit = false
  PapelsaCloudService papelsaCloudService

  @PostConstruct()
  void initFirebase() {

  }

  @PreDestroy()
  void cleanup() {

  }


}
