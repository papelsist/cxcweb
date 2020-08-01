import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { select, Store, Action } from '@ngrx/store';
import * as fromCobros from './cobros.reducer';
import * as CobrosSelectors from './cobros.selectors';
import {
  setPeriodo,
  setSearchTerm,
  loadCobros,
  toggleDisponibles,
} from './cobros.actions';

import { Periodo, Cartera, Cobro } from '@nx-papelsa/shared/utils/core-models';
import { CXCFacade } from '@nx-papelsa/shared/cxc/data-acces';

@Injectable()
export class CobrosFacade {
  loaded$ = this.store.pipe(select(CobrosSelectors.getCobrosLoaded));
  loading$ = this.store.pipe(select(CobrosSelectors.getCobrosLoading));
  periodo$ = this.store.pipe(select(CobrosSelectors.getCobrosPeriodo));
  search$ = this.store.pipe(select(CobrosSelectors.getCobrosSearchTerm));
  allCobros$ = this.store.pipe(select(CobrosSelectors.getAllCobros));
  selectedCobros$ = this.store.pipe(select(CobrosSelectors.getSelected));
  cartera$ = this.cxcFacade.cartera$;
  constructor(
    private store: Store<fromCobros.CobrosPartialState>,
    private cxcFacade: CXCFacade,
    private router: Router
  ) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }

  cambiarPeriodo(periodo: Periodo) {
    this.dispatch(setPeriodo({ periodo }));
  }

  toggleDisponibles() {
    this.dispatch(toggleDisponibles());
  }

  setSearchTerm(searchTerm: string) {
    this.dispatch(setSearchTerm({ searchTerm }));
  }

  loadCobros(periodo: Periodo, cartera: string) {
    this.dispatch(loadCobros({ periodo, cartera }));
  }

  edit(id: string, cartera: Cartera) {
    this.router.navigate([
      cartera.descripcion.toLowerCase(),
      'cobros',
      'edit',
      id,
    ]);
  }
}
