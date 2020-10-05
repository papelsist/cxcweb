import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { finalize, takeUntil } from 'rxjs/operators';
import { TdDialogService } from '@covalent/core/dialogs';

import {
  Cliente,
  CuentaPorCobrarDTO,
  Periodo,
} from '@nx-papelsa/shared/utils/core-models';
import {
  ClienteSearchOptions,
  ClientesFacade,
  ClientesService,
} from '@nx-papelsa/shared/clientes/data-access-clientes';
import { BaseComponent } from '@nx-papelsa/shared/utils/ui-common';

@Component({
  selector: 'nx-papelsa-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.scss'],
})
export class FacturasComponent extends BaseComponent implements OnInit {
  periodo: Periodo;
  loading = false;
  facturas: CuentaPorCobrarDTO[];
  selected: CuentaPorCobrarDTO[] = [];
  cliente: Cliente;
  pendientes = true;
  STORE_KEY = 'facturas-por-cliente.data';

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
      Periodo.fromNow(30)
    );
    this.pendientes =
      JSON.parse(sessionStorage.getItem(`${this.STORE_KEY}.pendientes`)) ||
      (true as boolean);
  }

  load() {
    let params: ClienteSearchOptions = { pendientes: this.pendientes };
    if (!this.pendientes) {
      params.periodo = this.periodo;
    }
    this.loading = true;
    this.service
      .facturas(this.cliente, params)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        (res) => (this.facturas = res),
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

  onDrilldown(cxc: CuentaPorCobrarDTO) {
    this.router.navigate([cxc.id], { relativeTo: this.route });
  }

  onSelection(rows: CuentaPorCobrarDTO[]) {
    this.selected = rows;
  }

  onPrint(cxc: CuentaPorCobrarDTO) {}

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
