
import org.springframework.web.servlet.i18n.FixedLocaleResolver
import sx.security.UserPasswordEncoderListener
import sx.security.UserInfoClaimpProvider
// Place your Spring DSL code here
import com.luxsoft.CustomAuditLogListener
import com.luxsoft.cfdix.v33.CfdiCadenaBuilder33
import com.luxsoft.cfdix.v33.CfdiSellador33
import com.luxsoft.cfdix.v33.NotaBuilder
import com.luxsoft.cfdix.v33.NotaDeCargoBuilder
import com.luxsoft.cfdix.v33.ReciboDePagoBuilder
import com.luxsoft.cfdix.v33.NotaDeCargoPdfGenerator

import sx.security.UserInfoClaimpProvider
import sx.core.ClienteLogListener
import sx.core.ClienteCreditoLogListener
import sx.core.ClienteContactosLogListener
import sx.core.ClienteComentarioLogListener

beans = {
    userPasswordEncoderListener(UserPasswordEncoderListener)
    userInfoClaimpProvider(UserInfoClaimpProvider)

    clienteLogListener(ClienteLogListener){
      lxClienteService = ref('lxClienteService')
    }
    clienteCreditoLogListener(ClienteCreditoLogListener){
      lxClienteService = ref('lxClienteService')
    }
    clienteContactosLogListener(ClienteContactosLogListener) {
      lxClienteService = ref('lxClienteService')
    }
    clienteComentarioLogListener(ClienteComentarioLogListener) {
      lxClienteService = ref('lxClienteService')
    }

    /*customAuditLogListener(CustomAuditLogListener) {
        dataSource = ref('dataSource')
    }
    */

    cfdiCadenaBuilder(CfdiCadenaBuilder33){}

    cfdiSellador(CfdiSellador33){
        cadenaBuilder = ref('cfdiCadenaBuilder')
    }

    notaBuilder(NotaBuilder){
        sellador = ref('cfdiSellador')
    }
    notaDeCargoBuilder(NotaDeCargoBuilder){
        sellador = ref('cfdiSellador')
    }
    reciboDePagoBuilder(ReciboDePagoBuilder){
        sellador = ref('cfdiSellador')
    }

    notaDeCargoPdfGenerator(NotaDeCargoPdfGenerator){
        cfdiLocationService = ref('cfdiLocationService')
    }

    localeResolver(FixedLocaleResolver, Locale.US){
        defaultLocale = new Locale('es', 'MX')
        Locale.setDefault(defaultLocale)
    }

    userInfoClaimpProvider(UserInfoClaimpProvider) {}
}
