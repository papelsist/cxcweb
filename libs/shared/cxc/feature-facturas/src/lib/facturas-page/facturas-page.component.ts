import { Component, OnInit } from '@angular/core';

import { FacturasFacade } from '@nx-papelsa/shared/cxc/data-access-facturas';
import { BehaviorSubject } from 'rxjs';

import {
  Periodo,
  CuentaPorCobrarDTO,
  Cartera,
} from '@nx-papelsa/shared/utils/core-models';

import { map } from 'rxjs/operators';

@Component({
  selector: 'nx-papelsa-facturas-page',
  templateUrl: './facturas-page.component.html',
  styleUrls: ['./facturas-page.component.scss'],
})
export class FacturasPageComponent implements OnInit {
  cartera$ = this.facade.cartera$;
  periodo$ = this.facade.periodo$;
  facturas$ = this.facade.allFacturas$;
  search$ = this.facade.search$;
  pendientes$ = this.facade.pendientes$;
  loading$ = this.facade.loading$;

  _selected$ = new BehaviorSubject<CuentaPorCobrarDTO[]>([]);

  selected$ = this._selected$.asObservable();
  disponibles$ = this.selected$.pipe(
    map((selected) => selected.filter((item) => item.total > 0 && item.cfdi))
  );

  disponiblesDisabled$ = this.disponibles$.pipe(
    map((disponibles) => disponibles.length <= 0)
  );

  constructor(private facade: FacturasFacade) {}

  ngOnInit(): void {}

  reload() {
    this.facade.load();
  }

  onDrilldown(event: CuentaPorCobrarDTO, cartera: Cartera) {
    this.facade.edit(event, cartera);
  }

  enviarPorCorreo(disponibles: CuentaPorCobrarDTO[]) {}

  onPeriodoChanged(periodo: Periodo) {
    this.facade.cambiarPeriodo(periodo);
  }

  filter(event: string) {
    this.facade.setSearchTerm(event);
  }

  onSelection(event: CuentaPorCobrarDTO[]) {
    this._selected$.next(event);
  }

  onPrint(cxc: CuentaPorCobrarDTO) {
    console.log('Print: ', cxc);
  }

  togglePendientes({ checked }) {
    this.facade.pendientes();
  }
}
