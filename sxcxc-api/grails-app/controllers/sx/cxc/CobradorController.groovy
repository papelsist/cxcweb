package sx.cxc

import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import sx.core.Cobrador

@Secured("hasAnyRole('ROLE_ADMIN', 'ROLE_CXC', 'ROLE_CXC_ADMIN')")
class CobradorController extends RestfulController<Cobrador>{
    static responseFormats = ['json']

    CobradorController(){
        super(Cobrador)
    }

    @Override
    protected List<Cobrador> listAllResources(Map params) {
        params.max = 500
        return super.listAllResources(params)
    }
}
