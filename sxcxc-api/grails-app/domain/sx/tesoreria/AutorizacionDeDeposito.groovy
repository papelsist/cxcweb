package sx.tesoreria


class AutorizacionDeDeposito {
  String uid
  Date fecha
  String comentario
  String createUser

  static constraints = {
    comentario nullable:true
  }
}
