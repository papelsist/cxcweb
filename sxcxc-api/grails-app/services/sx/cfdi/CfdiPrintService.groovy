package sx.cfdi

import groovy.transform.CompileDynamic
import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j

import grails.web.context.ServletContextHolder
import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional


import com.luxsoft.cfdix.v33.V33PdfGeneratorPos
import com.cfdi4.V4PdfGeneratorPos
import com.luxsoft.cfdix.v33.NotaPdfGenerator
import com.cfdi4.V4NotaPdfGenerator
import com.cfdi4.V4NotaDeCargoPdfGenerator
import com.cfdi4.V4ReciboDePagoPdfGenerator
import com.luxsoft.cfdix.v33.ReciboDePagoPdfGenerator
import com.luxsoft.cfdix.v33.NotaDeCargoPdfGenerator

import sx.cxc.Cobro
import sx.cxc.NotaDeCargo
import sx.cxc.NotaDeCredito
import sx.reports.ReportService

/**
 * Servicios de impresion de facturas centralizados
 *
 */
 @Slf4j
 // @GrailsCompileStatic
class CfdiPrintService {

    CfdiLocationService cfdiLocationService

    ReportService reportService

    NotaDeCargoPdfGenerator notaDeCargoPdfGenerator

    @Transactional
    byte[] getPdf(Cfdi cfdi){
        log.debug('Genenrando PDF para CFDI: {}-{} Origen: {}', cfdi.serie, cfdi.folio, cfdi.origen)
        String fileName = cfdi.url.getPath().substring(cfdi.url.getPath().lastIndexOf('/')+1)
        fileName = fileName.replaceAll('.xml', '.pdf')
        File file = new File(cfdiLocationService.getCfdiLocation(cfdi), fileName)
        validarExistenciaXml(cfdi)
        if(!file.exists()){
            log.info('No hay impresion generada, generando archivo PDF: {}', fileName);
            ByteArrayOutputStream out = generarPdf(cfdi)
            file.setBytes(out.toByteArray())
        }
        return file.getBytes()
    }

    private validarExistenciaXml(Cfdi cfdi) {
        cfdiLocationService.getXml(cfdi)
    }

    /**
    * Generar el JasperPrint para el CFDI
    *
    *
    *
    **/
    ByteArrayOutputStream generarPdf( Cfdi cfdi) {

        switch(cfdi.origen) {
            case 'VENTA':
                return generarFactrura(cfdi)
            case 'NOTA_CREDITO':
                return generarNotaDeCredito(cfdi)
            case 'NOTA_CARGO':
                return generarNotaDeCargo(cfdi)
            case 'COBROS':
            case 'PAGOS':
                return generarReciboDePago(cfdi)
            default:
                throw new RuntimeException("Origen de CFDI incorrecto: {cfdi.origen}")
            break
        }
    }

    /**
    * Genera el JasperPrint PDF (ByteArrayOutputStream) para Comprobantes tipo VENTA
    *
    **/
    ByteArrayOutputStream  generarFactrura(Cfdi cfdi){
        println "imprimiendo Factura !!!"
        String realPath = ServletContextHolder.getServletContext().getRealPath("/reports") ?: 'reports'
        Map data = null
        if(cfdi.version == '3.3'){
            data = V33PdfGeneratorPos.getReportData(cfdi)
        }else{
            data = V4PdfGeneratorPos.getReportData(cfdi)
        }
        Map parametros = data['PARAMETROS']
        parametros.PAPELSA = realPath + '/PAPEL_CFDI_LOGO.jpg'
        parametros.IMPRESO_IMAGEN = realPath + '/Impreso.jpg'
        parametros.FACTURA_USD = realPath + '/facUSD.jpg'
        return reportService.run('PapelCFDI3.jrxml', data['PARAMETROS'], data['CONCEPTOS'])
    }

    /**
    * Genera el JasperPrint PDF (ByteArrayOutputStream) para Comprobantes tipo Nota de Credito
    *
    **/
    public ByteArrayOutputStream generarNotaDeCredito( Cfdi cfdi) {
        String realPath = ServletContextHolder.getServletContext().getRealPath("/reports") ?: 'reports'
        NotaDeCredito nota = NotaDeCredito.where{cfdi == cfdi}.find()
        Map data =null
        if(cfdi.versionCfdi == '3.3'){
            data = NotaPdfGenerator.getReportData(nota)
        }else{
            data = V4NotaPdfGenerator.getReportData(nota)
        }
        Map parametros = data['PARAMETROS']
        parametros.LOGO = realPath + '/PAPEL_CFDI_LOGO.jpg'
        return reportService.run('PapelCFDI3Nota.jrxml', data['PARAMETROS'], data['CONCEPTOS'])
    }

    /**
    * Genera el JasperPrint PDF (ByteArrayOutputStream) para Comprobantes tipo Nota de Cargo
    *
    **/
    public ByteArrayOutputStream generarNotaDeCargo( Cfdi cfdi) {
        def realPath = ServletContextHolder.getServletContext().getRealPath("/reports") ?: 'reports'
        NotaDeCargo cargo = NotaDeCargo.where{cfdi == cfdi}.find()
        Map data =null
         if(cfdi.versionCfdi == '3.3'){
            data = notaDeCargoPdfGenerator.getReportData(cargo)
        }else{
            data = V4NotaDeCargoPdfGenerator.getReportData(cargo)
        }
        Map parametros = data['PARAMETROS']
        parametros.LOGO = realPath + '/PAPEL_CFDI_LOGO.jpg'
        return reportService.run('PapelCFDI3Nota.jrxml', data['PARAMETROS'], data['CONCEPTOS'])
    }

    /**
    * Genera el JasperPrint PDF (ByteArrayOutputStream) para Comprobantes tipo Recibo de Pago
    *
    **/
    public ByteArrayOutputStream generarReciboDePago( Cfdi cfdi) {
        String realPath = ServletContextHolder.getServletContext().getRealPath("/reports") ?: 'reports'
        Cobro cobro = Cobro.where{cfdi == cfdi}.find()
         Map data =null
         if(cfdi.versionCfdi == '3.3'){
            data = ReciboDePagoPdfGenerator.getReportData(cobro)
        }else{
            data = V4ReciboDePagoPdfGenerator.getReportData(cobro)
        }
        Map parametros = data['PARAMETROS']
        parametros.LOGO = realPath + '/PAPEL_CFDI_LOGO.jpg'
       return reportService.run('ReciboDePagoCFDI33.jrxml', data['PARAMETROS'], data['CONCEPTOS'])
    }


}
