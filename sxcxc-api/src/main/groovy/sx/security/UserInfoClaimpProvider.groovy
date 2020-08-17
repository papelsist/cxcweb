package sx.security

import groovy.util.logging.Slf4j

import com.nimbusds.jwt.JWTClaimsSet
import org.springframework.security.core.userdetails.UserDetails 

import grails.plugin.springsecurity.rest.token.generation.jwt.CustomClaimProvider
import grails.compiler.GrailsCompileStatic

@GrailsCompileStatic
@Slf4j
class UserInfoClaimpProvider  implements CustomClaimProvider{

    @Override
    void provideCustomClaims(JWTClaimsSet.Builder builder, UserDetails details, String principal, Integer expiration) {
        User.withNewSession{
            log.debug('Agregando las propiedades [displayName y email] del usuario al JWTClaimsSet ')
            User user = User.where{username == details.username}.find()
            builder.claim('displayName', user.nombre)
            builder.claim('email', user.email)
        }
    }

}