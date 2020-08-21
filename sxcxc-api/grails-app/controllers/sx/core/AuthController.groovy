package sx.core

import groovy.util.logging.Slf4j

import grails.rest.*
import grails.plugin.springsecurity.annotation.Secured
import org.apache.commons.lang3.exception.ExceptionUtils

import sx.security.User

@Slf4j
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
class AuthController {

    static responseFormats = ['json']


    def buscarPorNip(){

         def nip = params['nip'];
         
         User user = User.where {nip == nip}.find();

         if(user && !user.getAuthorities().find{it.authority=='ROLE_AUTORIZACION_CXC'}){
           
           respond([message: "No tiene el ROL de Autorizacion verifique su NIP "], status: 500)
            return
        }
        if (user == null) {
            
            respond ([message: "Not Found "], 'status': 500)
            return
        }
        respond user 
    }


}
