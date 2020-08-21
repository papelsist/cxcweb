import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { select, Store, Action } from '@ngrx/store';
import * as fromFacturas from './facturas.reducer';
import * as FacturasSelectors from './facturas.selectors';

import {
  Periodo,
  Cartera,
  CuentaPorCobrar,
} from '@nx-papelsa/shared/utils/core-models';

import { CXCFacade } from '@nx-papelsa/shared/cxc/data-acces';
import {
  setFacturasPeriodo,
  setFacturasSearchTerm,
  loadFacturas,
  togglePendientes,
} from './facturas.actions';

@Injectable()
export class FacturasFacade {
  loaded$ = this.store.pipe(select(FacturasSelectors.getFacturasLoaded));
  loading$ = this.store.pipe(select(FacturasSelectors.getFacturasLoading));
  allFacturas$ = this.store.pipe(select(FacturasSelectors.getAllFacturas));
  selectedFactura$ = this.store.pipe(select(FacturasSelectors.getSelected));
  search$ = this.store.pipe(select(FacturasSelectors.getFacturasSearchTerm));
  periodo$ = this.store.pipe(select(FacturasSelectors.getFacturasPeriodo));
  pendientes$ = this.store.pipe(select(FacturasSelectors.getPendientes));

  current$ = this.store.pipe(select(FacturasSelectors.getSelectedId));
  cartera$ = this.cxcFacade.cartera$;

  constructor(
    private store: Store<fromFacturas.FacturasPartialState>,
    private cxcFacade: CXCFacade,
    private router: Router
  ) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
  cambiarPeriodo(periodo: Periodo) {
    this.dispatch(setFacturasPeriodo({ periodo }));
  }

  setSearchTerm(searchTerm: string) {
    this.dispatch(setFacturasSearchTerm({ searchTerm }));
  }

  load() {
    this.dispatch(loadFacturas());
  }

  edit(factura: Partial<CuentaPorCobrar>, cartera: Cartera) {
    this.router.navigate([
      cartera.descripcion.toLowerCase(),
      'facturas',
      'edit',
      factura.id,
    ]);
  }

  pendientes() {
    this.dispatch(togglePendientes());
  }
}
