import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Cliente,
  ClienteCredito,
  MedioDeContacto,
} from '@nx-papelsa/shared/utils/core-models';
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
    this.facade.updateCliente(cliente);
  }

  onEditCredito(cliente: Cliente, credito: Update<ClienteCredito>) {
    this.facade.updateClienteCredito(cliente.id, credito);
  }

  onEditMedio(cliente: Cliente, medio: Update<MedioDeContacto>) {
    this.facade.updateMedioDeContacto(cliente.id, medio);
  }

  onAddMedio(cliente: Cliente, medio: Partial<MedioDeContacto>) {
    this.facade.addMedioDeContacto(cliente.id, medio);
  }
  onDeleteMedio(cliente: Cliente, medio: MedioDeContacto) {
    this.facade.deleteMedioDeContacto(cliente.id, medio);
  }
}
