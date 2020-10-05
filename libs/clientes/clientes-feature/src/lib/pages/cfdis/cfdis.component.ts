import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { finalize, takeUntil } from 'rxjs/operators';
import { TdDialogService } from '@covalent/core/dialogs';

import { Cfdi, Cliente, Periodo } from '@nx-papelsa/shared/utils/core-models';
import {
  ClienteSearchOptions,
  ClientesFacade,
  ClientesService,
} from '@nx-papelsa/shared/clientes/data-access-clientes';
import { BaseComponent } from '@nx-papelsa/shared/utils/ui-common';

@Component({
  selector: 'nx-papelsa-cfdis',
  templateUrl: './cfdis.component.html',
  styleUrls: ['./cfdis.component.scss'],
})
export class CfdisComponent extends BaseComponent implements OnInit {
  periodo: Periodo;
  loading = false;
  cfdis: Cfdi[];
  selected: Cfdi[] = [];
  cliente: Cliente;

  STORE_KEY = 'cfdis-por-cliente.data';

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
    let params: ClienteSearchOptions = {
      pendientes: false,
      periodo: this.periodo,
    };

    this.loading = true;
    this.service
      .cfdis(this.cliente, params)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        (res) => (this.cfdis = res),
        (error) => this.handleError(error)
      );
  }

  onPeriodoChanged(periodo: Periodo) {
    this.periodo = periodo;
    Periodo.saveOnSessionStorage(`${this.STORE_KEY}.periodo`, periodo);
    this.load();
  }

  onDrilldown(cfdi: Cfdi) {
    // this.router.navigate([cfdi.id], { relativeTo: this.route });
  }

  onSelection(rows: Cfdi[]) {
    this.selected = rows;
  }

  onPrint(cfdi: Cfdi) {}

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
