import { Component, OnInit } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import {
  Periodo,
  CuentaPorCobrarDTO,
  Cartera,
} from '@nx-papelsa/shared/utils/core-models';

import { map, finalize, catchError } from 'rxjs/operators';

import { JuridicoService } from '../juridico.service';

@Component({
  selector: 'nx-papelsa-jur-cxc-page',
  templateUrl: './jur-cxc-page.component.html',
  styleUrls: ['./jur-cxc-page.component.scss'],
})
export class JurCxcPageComponent implements OnInit {
  periodo = Periodo.fromNow(365);
  facturas$: Observable<any[]>;
  search$: Observable<any[]>;
  loading$ = new BehaviorSubject(false);

  _selected$ = new BehaviorSubject<CuentaPorCobrarDTO[]>([]);

  selected$ = this._selected$.asObservable();
  disponibles$ = this.selected$.pipe(
    map((selected) => selected.filter((item) => item.total > 0 && item.cfdi))
  );

  disponiblesDisabled$ = this.disponibles$.pipe(
    map((disponibles) => disponibles.length <= 0)
  );

  constructor(private service: JuridicoService) {}

  ngOnInit(): void {
    this.reload();
  }

  reload() {
    this.loading$.next(true);
    this.facturas$ = this.service
      .list(this.periodo)
      .pipe(finalize(() => this.loading$.next(false)));
  }

  onDrilldown(event: CuentaPorCobrarDTO,) {
    // this.facade.edit(event, cartera);
  }

  enviarPorCorreo(disponibles: CuentaPorCobrarDTO[]) {}

  onPeriodoChanged(periodo: Periodo) {
    // this.facade.cambiarPeriodo(periodo);
  }

  filter(event: string) {
    // this.facade.setSearchTerm(event);
  }

  onSelection(event: CuentaPorCobrarDTO[]) {
    this._selected$.next(event);
  }

  onPrint(cxc: CuentaPorCobrarDTO) {
    console.log('Print: ', cxc);
  }

  togglePendientes({ checked }) {
    // this.facade.pendientes();
  }
}
