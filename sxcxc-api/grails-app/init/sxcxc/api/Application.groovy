package sxcxc.api

import grails.boot.GrailsApp
import grails.boot.config.GrailsAutoConfiguration
import org.springframework.scheduling.annotation.EnableScheduling
import groovy.transform.CompileStatic

@CompileStatic
@EnableScheduling
class Application extends GrailsAutoConfiguration {
    static void main(String[] args) {
        GrailsApp.run(Application, args)
    }
}
