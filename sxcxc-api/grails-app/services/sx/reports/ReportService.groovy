package sx.reports

import groovy.util.logging.Slf4j

import grails.compiler.GrailsCompileStatic
import grails.plugins.jasper.JasperExportFormat
import grails.plugins.jasper.JasperReportDef
import grails.plugins.jasper.JasperService

import grails.gorm.transactions.Transactional

@Transactional
// @GrailsCompileStatic
@Slf4j
class ReportService {

    JasperService jasperService

    ByteArrayOutputStream run(String reportName, Map params ) {
        log.debug("Ejecutando reporte {}, parametros: {}", reportName, params)
        def reportDef= new JasperReportDef(
                name: reportName,
                fileFormat: JasperExportFormat.PDF_FORMAT,
                parameters: params
        )
        ByteArrayOutputStream pdfStream = jasperService.generateReport(reportDef)
        return pdfStream
    }

    ByteArrayOutputStream run(String reportName, Map params, Collection data){
        log.debug("Ejecutando reporte ${reportName} con parametros: ${params} y data: ${data}")
        def reportDef=new JasperReportDef(
                name:reportName,
                fileFormat: JasperExportFormat.PDF_FORMAT,
                parameters:params,
                reportData:data
        )
        ByteArrayOutputStream  stream=jasperService.generateReport(reportDef)
        return stream
    }
}
