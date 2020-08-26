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

}
