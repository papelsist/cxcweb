package sx.cloud

trait LxEntity {

  Map<String, Object> toFirebaseMap() {
    Map data = this.properties
    return filter(data)
  }

  Map<String, Object> filter(Map<String, Object> data) {
    data = data.findAll{ k, v -> !['class','constraints', 'errors'].contains(k) }
    return data
  }

  /*
  void copyProperties(source, target) {
    def (sProps, tProps) = [source, target]*.properties*.keySet()
    def commonProps = sProps.intersect(tProps) - ['class', 'metaClass', 'additionalMetaMethods']
    commonProps.each { target[it] = source[it] }
  }
  */
}
