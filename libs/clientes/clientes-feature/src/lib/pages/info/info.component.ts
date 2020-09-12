import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente, ClienteCredito } from '@nx-papelsa/shared/utils/core-models';
import { ClientesFacade } from '@nx-papelsa/shared/clientes/data-access-clientes';
import { Update } from '@ngrx/entity';

@Component({
  selector: 'nx-papelsa-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {
  cliente$ = this.facade.currentCliente$;
  constructor(private facade: ClientesFacade) {}

  ngOnInit(): void {}

  onEditCliente(cliente: Update<Cliente>) {
    console.log('Actualizando cliente: ', cliente);
    this.facade.updateCliente(cliente);
  }

  onEditCredito(cliente: Cliente, credito: Update<ClienteCredito>) {
    console.log('Actualizando credito: ', credito);
    this.facade.updateClienteCredito(cliente.id, credito);
  }
}
