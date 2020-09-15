package sx.sat


import grails.rest.*
import grails.converters.*
import grails.gorm.transactions.*
import grails.compiler.GrailsCompileStatic

/**
* API Enpoint para x
*
*/
@Transactional(readOnly = true)
@GrailsCompileStatic
class BancoSatController {
    
    BancoSatController() {}

    def index(Integer max) {
        params.max = Math.min(max ?: 20, 100)
        params.sort = params.sort ?:'nombreCorto'
        params.order = params.order ?:'desc'
        def query = BancoSat.where {}
        if(params.term){
            def search = '%' + params.term + '%'
            query = query.where { nombreCorto =~ search }
        }
        respond query.list(params), model:[bookCount: BancoSat.count()]
    }
    
}
