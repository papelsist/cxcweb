package sx.cloud.papws

import sx.cfdi.Cfdi
import sx.cfdi.CfdiPrintService
import sx.cloud.PapelsaCloudService

class ExportadorDeFacturas {

  PapelsaCloudService papelsaCloudService
  CfdiPrintService cfdiPrintService

  void uploadToFirestorage(Cfdi cfdi) {
    pushPdf(cfdi)
    pushXml(cfdi)
  }

  void pushPdf(Cfdi cfdi) {
    String objectName =buildOjbectName(cfdi, 'pdf')
    byte[] data = this.cfdiPrintService.getPdf(cfdi)
    Map<String,Object> metaData = [
      size: data.length, uuid:
      cfdi.uuid, receptorRfc:
      cfdi.receptorRfc, tipoArchivo: 'pdf'
    ]
    this.papelsaCloudService
      .uploadDocument(objectName, data, "application/pdf", metaData)
  }

  void pushXml(Cfdi cfdi) {
    String objectName =buildOjbectName(cfdi, 'xml')
    byte[] data = cfdi.getUrl().getBytes()
    Map<String,Object> metaData = [
      size: data.length,
      uuid: cfdi.uuid,
      receptorRfc: cfdi.receptorRfc,
      tipoArchivo: 'xml'
    ]
    this.papelsaCloudService
      .uploadDocument(objectName, data, "text/xml", metaData)
  }

  String buildOjbectName(Cfdi cfdi, String sufix) {
    return "cfdis/${cfdi.serie}-${cfdi.folio}.${sufix}"
  }
}
