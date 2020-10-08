package sx.cxc

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

import sx.cloud.LxEntity

@ToString(includeNames=true,includePackage=false)
@EqualsAndHashCode(includeFields = true, includes = 'id, fecha, tipo')
class  Antiguedad implements LxEntity{

  String id
  Date fecha
  String tipo

  Double total
  Double saldo
  Double porVencer
  Double vencido
  Double de1_30
  Double de31_60
  Double de61_90
  Double mas90


  Date dateCreated
  Date lastUpdated
  String createUser
  String updateUser

  static constraints = {
    fecha unique:['tipo']
  }

  static mapping = {
    id generator:'uuid'
    fecha type: 'date'
  }
}
