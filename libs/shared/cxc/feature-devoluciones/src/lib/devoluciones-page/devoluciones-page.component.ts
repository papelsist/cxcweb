import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { BehaviorSubject } from 'rxjs';
import { map, filter, takeUntil } from 'rxjs/operators';

import {
  DevolucionesFacade,
  DevolucionesEntity,
} from '@nx-papelsa/shared/cxc/data-access-devoluciones';

import {
  Periodo,
  Cartera,
  NotaDeCredito,
} from '@nx-papelsa/shared/utils/core-models';

import { DevolucionCreateDialogComponent } from '@nx-papelsa/shared/cxc/ui-devoluciones';
import { BaseComponent } from '@nx-papelsa/shared/utils/ui-common';

@Component({
  selector: 'nx-papelsa-devoluciones-page',
  templateUrl: './devoluciones-page.component.html',
  styleUrls: ['./devoluciones-page.component.scss'],
})
export class DevolucionesPageComponent extends BaseComponent implements OnInit {
  cartera$ = this.facade.cartera$;
  loading$ = this.facade.loading$;
  periodo$ = this.facade.periodo$;
  search$ = this.facade.search$;
  devoluciones$ = this.facade.allDevoluciones$;

  _selected$ = new BehaviorSubject<DevolucionesEntity[]>([]);
  selected$ = this._selected$.asObservable();
  disponiblesEnvio$ = this.selected$.pipe(
    map((selected) => selected.filter((item) => item.cfdi))
  );

  constructor(private facade: DevolucionesFacade, private dialog: MatDialog) {
    super();
  }

  ngOnInit(): void {
    this.facade.loaded$
      .pipe(
        filter((loaded) => !loaded),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.reload());
  }

  reload() {
    this.facade.loadDevoluciones();
  }

  onPeriodoChanged(periodo: Periodo) {
    this.facade.cambiarPeriodo(periodo);
  }
  filter(event: string) {
    this.facade.setSearchTerm(event);
  }

  onCreate(cartera: Cartera) {
    this.dialog
      .open(DevolucionCreateDialogComponent, {
        data: { cartera },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          console.log('Alta de Devolucion: ', res);
          this.facade.save(res);
        }
      });
  }

  onDrillDown(event: Partial<NotaDeCredito>, cartera: Cartera) {
    this.facade.edit(event, cartera);
  }
  onSelection(event: NotaDeCredito[]) {
    this._selected$.next(event);
  }
}
