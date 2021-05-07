import com.luxsoft.cfdix.v33.*
import org.springframework.web.servlet.i18n.FixedLocaleResolver
import sx.cloud.papws.ExportadorDeFacturas
import sx.core.*
import sx.security.UserInfoClaimpProvider
import sx.security.UserPasswordEncoderListener

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
