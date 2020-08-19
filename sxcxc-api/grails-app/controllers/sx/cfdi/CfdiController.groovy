package sx.cfdi


import groovy.util.logging.Slf4j
import groovy.transform.ToString

import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional
import grails.gorm.transactions.NotTransactional

import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController

import org.apache.commons.lang3.exception.ExceptionUtils


import sx.core.Cliente
import sx.cxc.Cobro
import sx.cxc.NotaDeCargo
import sx.cxc.NotaDeCredito
import sx.reports.ReportService
import sx.cloud.MailJetService

// @GrailsCompileStatic
@Secured("hasAnyRole('ROLE_ADMIN', 'ROLE_CXC', 'ROLE_CXC_ADMIN')")
@Slf4j
class CfdiController extends RestfulController {
    
    CfdiLocationService cfdiLocationService

    CfdiPrintService cfdiPrintService

    MailJetService mailJetService

    static responseFormats = ['json']

    CfdiController(){
        super(Cfdi)
    }

    def mostrarXml(Cfdi cfdi){
        if(cfdi == null ){
            notFound()
            return
        }
        def xml = cfdiLocationService.getXml(cfdi)
        render (file: xml, contentType: 'text/xml', filename: cfdi.fileName, encoding: "UTF-8")
    }
    
    def print( Cfdi cfdi) {
        if(cfdi == null ){
            notFound()
            return
        }
        log.info('Imprimiendo CFDI: {}', params)
        def pdf = cfdiPrintService.getPdf(cfdi)
        render (file: pdf, contentType: 'application/pdf', filename: cfdi.fileName)
    }

    def descargarXml(Cfdi cfdi) {
        def xml = cfdiLocationService.getXml(cfdi)
        File file = File.createTempFile('temp_', 'xml')
        file.setBytes(xml)

        response.setHeader "Content-disposition", "attachment; filename=${cfdi.fileName}"
        response.setHeader("Content-Length", "${file.length()}")
        response.setContentType("text/xml")
        InputStream contentStream = file.newInputStream()
        response.outputStream << contentStream
        webRequest.renderView = false
        // render (file: file, contentType: 'text/xml', filename: cfdi.fileName)
    }

    def enviarComprobantes(EnvioTask task) {
        if(task == null) {
            notFound()
            return
        }
        log.info('Payload: {} grupos', task.grupos.size())
        Map result = [:]
        task.grupos.each { grupo ->
            log.info('Enviando: {}', grupo)
            def mjLog =  mailJetService.enviarComprobantes(grupo)
            result[grupo.target] = mjLog
        }
        respond result, status:200
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, e)
        respond([message: message], status: 500)
    }

}

@ToString(includeNames = true)
public class EnvioTask {
    List<EnvioDeComprobantes> grupos
}

@ToString(includeNames = true)
public class EnvioDeComprobantes {
    String target;
    String source;
    String nombre;
    List<String> cfdis
    Boolean zip = true

    static constraints = {
        source email: true, nullable: true
        target email: true
    }
}



