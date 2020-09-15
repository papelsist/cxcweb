package sx.core

import grails.events.annotation.Subscriber
import grails.gorm.transactions.Transactional
import sx.inventario.Traslado

import sx.cloud.LxClienteCreditoService
import sx.core.LogUser

@Transactional
class ClienteCreditoService implements LogUser {

    LxClienteCreditoService lxClienteCreditoService

    ClienteCredito updateCliente(ClienteCredito credito) {
        ClienteCredito target = credito.save failOnError: true, flush: true
        // lxClienteCreditoService.push(target)
        logEntity(credito)
        return target

    }

}
