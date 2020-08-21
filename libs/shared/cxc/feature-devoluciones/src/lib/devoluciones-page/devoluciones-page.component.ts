import { Component, OnInit } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  DevolucionesFacade,
  DevolucionesEntity,
} from '@nx-papelsa/shared/cxc/data-access-devoluciones';
import {
  Periodo,
  Cartera,
  NotaDeCredito,
} from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'nx-papelsa-devoluciones-page',
  templateUrl: './devoluciones-page.component.html',
  styleUrls: ['./devoluciones-page.component.scss'],
})
export class DevolucionesPageComponent implements OnInit {
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

  constructor(private facade: DevolucionesFacade) {}

  ngOnInit(): void {
    this.facade.loadDevoluciones();
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
  onDrillDown(event: Partial<NotaDeCredito>, cartera: Cartera) {
    this.facade.edit(event, cartera);
  }
}
