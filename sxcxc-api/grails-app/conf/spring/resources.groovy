import sx.security.UserPasswordEncoderListener
import sx.security.UserInfoClaimpProvider
// Place your Spring DSL code here
beans = {
    userPasswordEncoderListener(UserPasswordEncoderListener)
    userInfoClaimpProvider(UserInfoClaimpProvider)

    // luxorAuthenticationProvider(LuxorAuthenticationProvider)
    // credentialsExtractor(LuxorJsonPayloadCredentialsExtractor)
}
