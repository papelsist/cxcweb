package sxcxc.api

import org.bouncycastle.jce.provider.BouncyCastleProvider

class BootStrap {

    def init = { servletContext ->
      java.security.Security.addProvider(new BouncyCastleProvider())
    }
    def destroy = {
    }
}
