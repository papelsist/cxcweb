package sx.contabilidad

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString


@EqualsAndHashCode(includes='mes')
@ToString(includes = 'mes, saldo,', includeNames=true,includePackage=false)
class SaldoClienteMensual implements Comparable {

    Integer mes

    Double inicial
    Double cargos
    Double abonos
    Double saldo
    Double saldoYtd
    
    Integer facturas
    Double facturasImporte

    Integer bonificaciones
    Double fonificacionesImporte

    Integer devoluciones
    Double devolucinesImporte
    
    Date corte
    Date cierre

    Date dateCreated
    Date lastUpdated
    String createUser
    String updateUser

    int compareTo(obj) {
        mes.compareTo(obj.mes)
    }

    static constraints = {
        createUser nullable: true
        updateUser nullable: true
        cierre nullable: true
    }

    static mapping ={
        cierre type: 'date'
        corte type: 'date'
    }

}
