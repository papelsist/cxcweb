package sx.contabilidad

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString


@EqualsAndHashCode(includes='ejercicio, cliente')
@ToString(includes = 'cliente, nombre,', includeNames=true,includePackage=false)
class SaldoCliente {

    String cliente
    String clave
    String nombre
    String rfc

    Integer ejercicio

    Double inicial
    Double cargos
    Double abonos
    Double saldo
    
    Map<String, SaldoClienteMensual> meses 

    Date cierre
    Date corte

    Date dateCreated
    Date lastUpdated
    String createUser
    String updateUser

    static constraints = {
        cliente unique:['ejercicio']
        createUser nullable: true
        updateUser nullable: true
        cierre nullable: true
    }

    static mapping ={
        cierre type: 'date'
        corte type: 'date'
    }

    static hasMany = [meses: SaldoClienteMensual]

}


