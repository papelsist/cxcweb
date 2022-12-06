import com.luxsoft.cfdix.v33.*
import org.springframework.web.servlet.i18n.FixedLocaleResolver
import sx.cloud.papws.ExportadorDeFacturas
import sx.core.*
import sx.security.UserInfoClaimpProvider
import sx.security.UserPasswordEncoderListener

import com.cfdi4.Cfdi4FacturaBuilder
import com.cfdi4.CfdiSellador4
import com.cfdi4.CfdiCadenaBuilder4
import com.cfdi4.CfdiTrasladoBuilder
import com.cfdi4.Cfdi4NotaBuilder
import com.cfdi4.Cfdi4NotaDeCargoBuilder
import com.cfdi4.Cfdi4PagoBuilder

// Place your Spring DSL code here

beans = {
  userPasswordEncoderListener(UserPasswordEncoderListener)
  userInfoClaimpProvider(UserInfoClaimpProvider)

  clienteLogListener(ClienteLogListener) {
    lxClienteService = ref('lxClienteService')
  }
  clienteCreditoLogListener(ClienteCreditoLogListener) {
    lxClienteService = ref('lxClienteService')
  }
  clienteContactosLogListener(ClienteContactosLogListener) {
    lxClienteService = ref('lxClienteService')
  }
  clienteComentarioLogListener(ClienteComentarioLogListener) {
    lxClienteService = ref('lxClienteService')
  }
  clienteContactos2LogListener(ClienteContactos2LogListener) {
    lxClienteService = ref('lxClienteService')
  }

  cfdiCadenaBuilder(CfdiCadenaBuilder33) {}

  cfdiSellador(CfdiSellador33) {
    cadenaBuilder = ref('cfdiCadenaBuilder')
  }

  notaBuilder(NotaBuilder) {
    sellador = ref('cfdiSellador')
  }
  notaDeCargoBuilder(NotaDeCargoBuilder) {
    sellador = ref('cfdiSellador')
  }
  reciboDePagoBuilder(ReciboDePagoBuilder) {
    sellador = ref('cfdiSellador')
  }

  cfdiCadenaBuilder4(CfdiCadenaBuilder4){}

  cfdiSellador4(CfdiSellador4){
      cfdiCadenaBuilder4 = ref('cfdiCadenaBuilder4')
  }

  cfdi4FacturaBuilder(Cfdi4FacturaBuilder) {
      cfdiSellador4= ref('cfdiSellador4')
  } 

  cfdiTrasladoBuilder(CfdiTrasladoBuilder) {
      cfdiSellador4= ref('cfdiSellador4')
  }
  
  cfdi4NotaBuilder(Cfdi4NotaBuilder) {
    cfdiSellador4= ref('cfdiSellador4')
  }

  cfdi4NotaDeCargoBuilder(Cfdi4NotaDeCargoBuilder) {
    cfdiSellador4= ref('cfdiSellador4')
  }

  cfdi4PagoBuilder(Cfdi4PagoBuilder) {
    cfdiSellador4= ref('cfdiSellador4')
  }

  notaDeCargoPdfGenerator(NotaDeCargoPdfGenerator) {
    cfdiLocationService = ref('cfdiLocationService')
  }

  localeResolver(FixedLocaleResolver, Locale.US) {
    defaultLocale = new Locale('es', 'MX')
    Locale.setDefault(defaultLocale)
  }

  userInfoClaimpProvider(UserInfoClaimpProvider) {}

  exportadorDeFacturas(ExportadorDeFacturas) {
    papelsaCloudService = ref('papelsaCloudService')
    cfdiPrintService = ref('cfdiPrintService')
  }


}
