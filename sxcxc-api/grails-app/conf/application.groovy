grails.plugin.springsecurity.active = false
grails.plugin.springsecurity.password.algorithm = 'bcrypt'
grails.plugin.springsecurity.userLookup.userDomainClassName = 'sx.security.User'
grails.plugin.springsecurity.userLookup.authorityJoinClassName = 'sx.security.UserRole'
grails.plugin.springsecurity.authority.className = 'sx.security.Role'
grails.plugin.springsecurity.rest.token.storage.jwt.expiration = 3600 * 15
grails.plugin.springsecurity.rest.token.storage.jwt.secret = 'sx.security.version2.uuid2423994939129'
grails.plugin.springsecurity.controllerAnnotations.staticRules = [
        [pattern: '/',                      access: ['permitAll']],
        [pattern: '/console/**',            access: ['permitAll']],
        [pattern: '/static/console/**',     access: ['permitAll']], // Grails 3.x
        [pattern: '/**/vendor/**',          access: ['permitAll']],
        [pattern: '/application/index',     access: ['permitAll']],
        [pattern: '/error',                 access: ['permitAll']],
        [pattern: '/index',                 access: ['permitAll']],
        [pattern: '/index.gsp',             access: ['permitAll']],
        [pattern: '/shutdown',              access: ['permitAll']],
        [pattern: '/assets/**',             access: ['permitAll']],
        [pattern: '/**/js/**',              access: ['permitAll']],
        [pattern: '/**/css/**',             access: ['permitAll']],
        [pattern: '/**/images/**',          access: ['permitAll']],
        [pattern: '/**/favicon.ico',        access: ['permitAll']],
        [pattern: '/oauth/access_token',    access: ['isAuthenticated()']],
]
grails.plugin.springsecurity.filterChain.chainMap = [
	[pattern: '/assets/**',      filters: 'none'],
	[pattern: '/**/js/**',       filters: 'none'],
	[pattern: '/**/css/**',      filters: 'none'],
	[pattern: '/**/images/**',   filters: 'none'],
	[pattern: '/**/favicon.ico', filters: 'none'],
    [
            pattern: '/api/**',
            filters: 'JOINED_FILTERS,-anonymousAuthenticationFilter,-exceptionTranslationFilter,-authenticationProcessingFilter,-securityContextPersistenceFilter,-rememberMeAuthenticationFilter'
    ],
    [
            pattern: '/api/login',
            filters: 'JOINED_FILTERS,-anonymousAuthenticationFilter,-exceptionTranslationFilter,-authenticationProcessingFilter,-securityContextPersistenceFilter,-rememberMeAuthenticationFilter'
    ],
    [
            pattern: '/**',
            filters: 'JOINED_FILTERS,-restTokenValidationFilter,-restExceptionTranslationFilter'
    ]
]
grails.plugin.console.enabled = true
