package sx.core

import groovy.transform.ToString
import groovy.transform.EqualsAndHashCode

import grails.validation.Validateable
import grails.web.databinding.WebDataBinding
import grails.gorm.dirty.checking.DirtyCheck


/**
 * Created by rcancino on 06/09/16.
 */
@ToString(includeNames=true,includePackage=false)
@EqualsAndHashCode(includes = "calle, numeroInterior, numeroExterior, colonia, municipio, codigoPostal, estado, pais")
@DirtyCheck
class Direccion implements Validateable, WebDataBinding {

    String calle

    String numeroInterior

    String numeroExterior

    String colonia

    String municipio

    String codigoPostal

    String estado

    String pais='MEXICO'

    BigDecimal latitud =  0

    BigDecimal longitud = 0



    static constraints = {
        calle(nullable:true,size:1..200)
        numeroInterior(size:1..50,nullable:true)
        numeroExterior(size:1..50,nullable:true)
        colonia(nullable:true)
        municipio(nullable:true)
        codigoPostal(nullable:true)
        estado(nullable:true)
        pais(nullable:true,size:1..100)
        latitud nullable: true
        longitud nullable: true
    }

    String toLabel(){
        return "Calle:${calle?:''} Ext#:${numeroExterior?:''} ${numeroInterior? 'Int#:' +numeroInterior :''} Col:${colonia?: ''} CP:${codigoPostal?:''} Del/Mun:${municipio?:''} ${estado?:''} ${pais?:''}"
    }

    Map toFirebaseMap() {
        return this.properties.findAll{ k, v -> !['class','constraints','constraintsMap', 'errors', 'longitud', 'latitud'].contains(k) }

    }


}
