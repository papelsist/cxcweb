package sx.cfdi


import grails.util.Environment
import grails.gorm.transactions.Transactional

import org.apache.commons.io.FileUtils

import sx.core.AppConfig
import sx.utils.ZipUtils

class CfdiLocationService {

    CfdiEdicomService cfdiEdicomService

    private AppConfig config

    @Transactional
    byte[] getXml(Cfdi cfdi, Boolean downloadIfNotFound = true){
        String fileName = cfdi.url.getPath().substring(cfdi.url.getPath().lastIndexOf('/')+1)
        File file = new File(getCfdiLocation(cfdi), fileName)
        println("++++++++++++++++++++++++")
        println("Cfdi URL: "+cfdi.url)
        println("FileNAme: "+fileName)
        println("++++++++++++++++++++++++")
        println("File: "+file)

        if(!file.exists() && downloadIfNotFound) {
            log.info('Cfdi no localizado en los servidores locales, descargandolo de EDICOM....');
            file = downloadXmlFromUUID(cfdi)
            // file = new File(getCfdiLocation(cfdi), fileName)
            return file.getBytes()

        }

        return file.getBytes()
    }

    def getCfdiLocation(Cfdi cfdi) {
        def year = cfdi.fecha[Calendar.YEAR]
        def month = cfdi.fecha[Calendar.MONTH] + 1
        def day = cfdi.fecha[Calendar.DATE]
        def dir = new File(getCfdiMainDir(), "${cfdi.emisor}/${year}/${month}/${day}")
        println("DIR: " +dir)
        dir.mkdirs()
        return dir
    }

    @Transactional
    def downloadXmlFromUUID(Cfdi cfdi) {
        def res = cfdiEdicomService.getCfdiFromUUID(cfdi)
        Map map = ZipUtils.descomprimir(res)
        def entry = map.entrySet().iterator().next()
        def dir = getCfdiLocation(cfdi)
        String fileName = "${cfdi.serie}-${cfdi.folio}_SIGNED.xml"
        File target = new File(dir, fileName)
        FileUtils.writeByteArrayToFile(target, entry.getValue())
        cfdi.url = target.toURI().toURL()
        cfdi.fileName = fileName
        cfdi.comentario = "Actualizado desde EDICOM"
        cfdi.save flush: true
        return target
    }

    AppConfig getConfig() {
        if(!this.config){
            this.config = AppConfig.first()
        }
        return this.config
    }


    def getCfdiMainDir() {
        if(Environment.current == Environment.DEVELOPMENT){
            String userHome = System.getProperty('user.home')
            return "${userHome}/cfdis"
        } else {
            return getConfig().cfdiLocation
        }
    }


}
