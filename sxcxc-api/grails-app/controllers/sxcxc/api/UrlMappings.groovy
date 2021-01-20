package sxcxc.api

class UrlMappings {

  static mappings = {
    delete "/$controller/$id(.$format)?"(action:"delete")
    get "/$controller(.$format)?"(action:"index")
    get "/$controller/$id(.$format)?"(action:"show")
    post "/$controller(.$format)?"(action:"save")
    put "/$controller/$id(.$format)?"(action:"update")
    patch "/$controller/$id(.$format)?"(action:"patch")

    "/api/zip"(controller: 'codigoPostal', action: 'find', method: 'GET')
    "/api/analytics/ventaMensual"(controller: 'analytics', action: 'ventaMensual')

    // Antiguedad de saldos
    "/api/analytics/ventaMensual"(controller: 'analytics', action: 'ventaMensual')
    "/api/cxc/antiguedades"(controller: 'antiguedad', action: 'index')
    "/api/cxc/antiguedades/generar"(controller: 'antiguedad', action: 'generar', method: 'GET')

    // Reportes BI
    "/api/analytics/bajaEnVentas"(controller: 'analytics', action:'bajaEnVentas', method: 'GET')
    "/api/analytics/mejoresClientes"(controller: 'analytics', action:'mejoresClientes', method: 'GET')
    "/api/analytics/ventasClientesResumen"(controller: 'analytics', action:'ventasClientesResumen', method: 'GET')
    "/api/analytics/clienteSinVentas"(controller: 'analytics', action:'clienteSinVentas', method: 'GET')
    "/api/analytics/comparativoMejoresClientes"(controller: 'analytics', action:'comparativoMejoresClientes', method: 'GET')
    "/api/analytics/ventasPorLineaCliente"(controller: 'analytics', action:'ventasPorLineaCliente', method: 'GET')

    // Antcipos SAT
    // "/sat/anticipos"(resources: 'anticipoSat', excludes:['create', 'edit','patch', 'delete'])
    "/api/anticipos/aplicaciones"(resources: 'anticipoSatDet', excludes:['create', 'edit','patch', 'delete'])
    "/api/anticipos/aplicaciones/timbrar/$id"(controller: 'anticipoSatDet', action: 'timbrar', method: 'PUT')


    "/"(controller: 'application', action:'index')
    "/api/session"(controller: 'application', action: 'session')
    "500"(view: '/error')
    "404"(view: '/notFound')
  }
}
