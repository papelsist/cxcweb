package sx.cxc

import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import sx.cxc.DespachoDeCobranza

@Secured("hasAnyRole('CXC_USER','ROLE_ADMIN', 'ROLE_CXC', 'ROLE_CXC_ADMIN')")
class DespachoDeCobranzaController extends RestfulController<DespachoDeCobranza>{

    DespachoDeCobranzaController(){
        super(DespachoDeCobranza)
    }

    @Override
    protected List<DespachoDeCobranza> listAllResources(Map params) {
        params.max=500
        return super.listAllResources(params)
    }
}
