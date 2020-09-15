package sx.core

import sx.cfdi.Cfdi
/**
*
*
* @deprecated Eesta entidad ha sido sustituida por: sx.cfdi.CancelacionDeCfdi
*/
@Deprecated
class CancelacionCfdi {

    String id
    String motivo
    //Cfdi cfdi
    URL acuse
    //byte[] message

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser

    static belongsTo = [cfdi: Cfdi]

    static constraints = {
        acuse url:true, nullable: true
        createUser nullable:true, maxSize: 100
        updateUser nullable:true, maxSize: 100
    }

    static  mapping={
        id generator:'uuid'
    }
}
