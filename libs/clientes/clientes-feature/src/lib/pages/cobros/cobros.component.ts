import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { finalize, takeUntil } from 'rxjs/operators';
import { TdDialogService } from '@covalent/core/dialogs';

import { Cliente, Cobro, Periodo } from '@nx-papelsa/shared/utils/core-models';
import {
  ClienteSearchOptions,
  ClientesFacade,
  ClientesService,
} from '@nx-papelsa/shared/clientes/data-access-clientes';
import { BaseComponent } from '@nx-papelsa/shared/utils/ui-common';

@Component({
  selector: 'nx-papelsa-cobros',
  templateUrl: './cobros.component.html',
  styleUrls: ['./cobros.component.scss'],
})
export class CobrosComponent extends BaseComponent implements OnInit {
  periodo: Periodo;
  loading = false;
  cobros: Cobro[];
  selected: Cobro[] = [];
  cliente: Cliente;
  pendientes = false;
  STORE_KEY = 'cobros-por-cliente.data';

  constructor(
    private dialogService: TdDialogService,
    private service: ClientesService,
    private facade: ClientesFacade,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.readStorage();
    this.facade.currentCliente$
      .pipe(takeUntil(this.destroy$))
      .subscribe((cte) => {
        this.cliente = cte;
        this.load();
      });
  }

  private readStorage() {
    this.periodo = Periodo.fromSessionStorage(
      `${this.STORE_KEY}.periodo`,
      Periodo.fromNow(90)
    );
  }

  load() {
    let params: ClienteSearchOptions = { pendientes: this.pendientes };
    if (!this.pendientes) {
      params.periodo = this.periodo;
    }
    this.loading = true;
    this.service
      .cobros(this.cliente, params)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        (res) => (this.cobros = res),
        (error) => this.handleError(error)
      );
  }

  togglePendientes(val: boolean) {
    this.pendientes = !val;
    sessionStorage.setItem(
      `${this.STORE_KEY}.pendientes`,
      this.pendientes.toString()
    );
    this.load();
  }

  onPeriodoChanged(periodo: Periodo) {
    this.periodo = periodo;
    Periodo.saveOnSessionStorage(`${this.STORE_KEY}.periodo`, periodo);
    this.load();
  }

  onDrilldown(nota: Cobro) {
    this.router.navigate([nota.id], { relativeTo: this.route });
  }

  onSelection(rows: Cobro[]) {
    this.selected = rows;
  }

  onPrint(nota: Cobro) {}

  handleError(response: any) {
    const message = response.error ? response.error.message : 'Error';
    const message2 = response.message ? response.message : '';
    console.error('API Call error: ', response);
    this.dialogService.openAlert({
      message: `Status code: ${response.status} ${message} ${message2}`,
      title: `Error ${response.status}`,
      closeButton: 'Cerrar',
    });
  }
}
