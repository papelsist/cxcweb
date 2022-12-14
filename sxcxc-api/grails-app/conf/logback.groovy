import grails.util.BuildSettings
import grails.util.Environment
import org.springframework.boot.logging.logback.ColorConverter
import org.springframework.boot.logging.logback.WhitespaceThrowableProxyConverter
import ch.qos.logback.core.util.FileSize
import java.nio.charset.Charset

conversionRule 'clr', ColorConverter
conversionRule 'wex', WhitespaceThrowableProxyConverter

// See http://logback.qos.ch/manual/groovy.html for details on configuration
appender('STDOUT', ConsoleAppender) {
  encoder(PatternLayoutEncoder) {
    charset = Charset.forName('UTF-8')
    pattern =
      '%clr(%d{HH:mm}){faint} ' + // Date
        '%clr(%5p) ' + // Log level
        '%clr(%-40.40logger{39}){cyan} %clr(:){faint} ' + // Logger
        '%m%n%wex' // Message
  }
}

def targetDir = BuildSettings.TARGET_DIR
// def USER_HOME = System.getProperty("user.home")
def HOME_DIR = Environment.isDevelopmentMode() ? targetDir : '.'
appender('FIREBASE', RollingFileAppender) {
  append = false
  encoder(PatternLayoutEncoder) {
    pattern =
      '%clr(%d{HH:mm}){faint} ' + // Date
        '%clr(%5p) ' + // Log level
        '%clr(%-40.40logger{39}){cyan} %clr(:){faint} ' + // Logger
        '%m%n%wex' // Message
  }
  rollingPolicy(TimeBasedRollingPolicy) {
    fileNamePattern = "${HOME_DIR}/logs/papws-firebase-%d{yyyy-MM-dd}.log"
    maxHistory = 5
    totalSizeCap = FileSize.valueOf("1GB")
  }
}

if (Environment.isDevelopmentMode()) {
  logger("org.pac4j", OFF, ['STDOUT'], false)

  logger("sx.core", DEBUG, ['STDOUT'], false)
  logger("sx.tesoreria", DEBUG, ['STDOUT'], false)
  logger("sx.cxc", DEBUG, ['STDOUT'], false)
  logger("sx.cfdi", DEBUG, ['STDOUT'], false)
  logger("sx.reports", DEBUG, ['STDOUT'], false)
  logger("com.luxsoft.cfdix.v33", DEBUG, ['STDOUT'], false)
  logger("com.luxsoft", DEBUG, ['STDOUT'], false)
  logger("sx.crm", DEBUG, ['STDOUT'], false)
  logger("sx.security", OFF, ['STDOUT'], false)
  logger("sx.cloud", DEBUG, ['STDOUT', 'FIREBASE'], false)
  logger("sx.bi", DEBUG, ['STDOUT'], false)
  logger("papws.api", DEBUG, ['STDOUT'], false)

}
if (Environment.current == Environment.PRODUCTION) {
  logger("org.pac4j", OFF, ['STDOUT'], false)
  logger("sx.core", INFO, ['STDOUT'], false)
  logger("sx.tesoreria", INFO, ['STDOUT'], false)
  logger("sx.cxc", INFO, ['STDOUT'], false)
  logger("sx.cfdi", INFO, ['STDOUT'], false)
  logger("sx.inventario", INFO, ['STDOUT'], false)
  logger("sx.reports", INFO, ['STDOUT'], false)
  logger("com.luxsoft.cfdix.v33", INFO, ['STDOUT'], false)
  logger("com.luxsoft", INFO, ['STDOUT'], false)
  logger("sx.integracion", INFO, ['STDOUT'], false)
  logger("sx.security", OFF, ['STDOUT'], false)
  logger("sx.cloud", INFO, ['STDOUT', 'FIREBASE'], false)
  logger("sx.bi", INFO, ['STDOUT'], false)
  logger("papws.api", INFO, ['STDOUT', 'FIREBASE'], false)

}

root(ERROR, ['STDOUT'])



/*
import grails.util.BuildSettings
import grails.util.Environment
import org.springframework.boot.logging.logback.ColorConverter
import org.springframework.boot.logging.logback.WhitespaceThrowableProxyConverter
import ch.qos.logback.core.util.FileSize
import java.nio.charset.Charset

conversionRule 'clr', ColorConverter
conversionRule 'wex', WhitespaceThrowableProxyConverter

// See http://logback.qos.ch/manual/groovy.html for details on configuration
appender('STDOUT', ConsoleAppender) {
  encoder(PatternLayoutEncoder) {
    charset = Charset.forName('UTF-8')
    pattern = '%level %logger{35} - %msg%n'
  }
}

def targetDir = BuildSettings.TARGET_DIR
def USER_HOME = System.getProperty("user.home")

appender('FIREBASE', RollingFileAppender) {
    append = false
    encoder(PatternLayoutEncoder) {
        pattern =
                '%clr(%5p) ' + // Log level
                '%clr(%-40.40logger{39}){cyan} %clr(:){faint} ' + // Logger
                '%msg%n' // Message
    }
    rollingPolicy(TimeBasedRollingPolicy) {
        fileNamePattern = "${USER_HOME}/.swx-logs/firebase-log_%d{yyyy-MM-dd}.log"
        maxHistory = 5
        totalSizeCap = FileSize.valueOf("1GB")
    }
}


if (Environment.isDevelopmentMode() && targetDir != null) {
    appender("FULL_STACKTRACE", FileAppender) {
        file = "${targetDir}/stacktrace.log"
        append = true
        encoder(PatternLayoutEncoder) {
            pattern = "%level %logger - %msg%n"
        }
    }
    logger("StackTrace", ERROR, ['FULL_STACKTRACE'], false)

    logger("org.springframework.security", OFF, ['STDOUT'], false)
    logger("grails.plugin.springsecurity", OFF, ['STDOUT'], false)
    logger("org.pac4j", OFF, ['STDOUT'], false)

    logger("ch.qos", OFF, ['STDOUT'], false)


    logger("sx.core", DEBUG, ['STDOUT'], false)
    logger("sx.tesoreria", DEBUG, ['STDOUT'], false)
    logger("sx.cxc", DEBUG, ['STDOUT'], false)
    logger("sx.cfdi", DEBUG, ['STDOUT'], false)
    logger("sx.reports", DEBUG, ['STDOUT'], false)
    logger("com.luxsoft.cfdix.v33", DEBUG, ['STDOUT'], false)
    logger("com.luxsoft", DEBUG, ['STDOUT'], false)
    logger("sx.crm", DEBUG, ['STDOUT'], false)
    logger("sx.security", OFF, ['STDOUT'], false)
    logger("sx.cloud", DEBUG, ['STDOUT', 'FIREBASE'], false)
    logger("sx.bi", DEBUG, ['STDOUT'], false)

}

if (Environment.isDevelopmentMode()) {

    logger("ch.qos", OFF, ['STDOUT'], false)

    logger("sx.core", DEBUG, ['STDOUT'], false)
    logger("sx.tesoreria", DEBUG, ['STDOUT'], false)
    logger("sx.cxc", DEBUG, ['STDOUT'], false)
    logger("sx.cfdi", DEBUG, ['STDOUT'], false)
    logger("sx.inventario", DEBUG, ['STDOUT'], false)
    logger("sx.reports", DEBUG, ['STDOUT'], false)
    logger("com.luxsoft.cfdix.v33", DEBUG, ['STDOUT'], false)
    logger("com.luxsoft", DEBUG, ['STDOUT'], false)
    logger("sx.integracion", DEBUG, ['STDOUT'], false)
    logger("sx.security", OFF, ['STDOUT'], false)
    logger("sx.cloud", DEBUG, ['STDOUT', 'FIREBASE'], false)
    logger("sx.bi", DEBUG, ['STDOUT'], false)


} else {
    root(ERROR, ['STDOUT'])
    logger("sx.cloud", INFO, ['STDOUT', 'FIREBASE'], false)

}
root(ERROR, ['STDOUT'])
*/
