import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { select, Store, Action } from '@ngrx/store';
import * as fromBonificaciones from './bonificaciones.reducer';
import * as BonificacionesSelectors from './bonificaciones.selectors';
import {
  setPeriodo,
  setSearchTerm,
  loadBonificaciones,
  saveBonificacion,
} from './bonificaciones.actions';

import {
  Periodo,
  Cartera,
  NotaDeCredito,
} from '@nx-papelsa/shared/utils/core-models';

import { CXCFacade } from '@nx-papelsa/shared/cxc/data-acces';

@Injectable()
export class BonificacionesFacade {
  loaded$ = this.store.pipe(
    select(BonificacionesSelectors.getBonificacionesLoaded)
  );
  loading$ = this.store.pipe(
    select(BonificacionesSelectors.getBonificacionesLoading)
  );
  search$ = this.store.pipe(
    select(BonificacionesSelectors.getBonificacionesSearchTerm)
  );

  periodo$ = this.store.pipe(
    select(BonificacionesSelectors.getBonificacionesPeriodo)
  );
  allBonificaciones$ = this.store.pipe(
    select(BonificacionesSelectors.getAllBonificaciones)
  );

  selectedBonificacion$ = this.store.pipe(
    select(BonificacionesSelectors.getSelected)
  );

  current$ = this.store.pipe(select(BonificacionesSelectors.getSelectedId));
  cartera$ = this.cxcFacade.cartera$;

  constructor(
    private store: Store<fromBonificaciones.BonificacionesPartialState>,
    private cxcFacade: CXCFacade,
    private router: Router
  ) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }

  cambiarPeriodo(periodo: Periodo) {
    this.dispatch(setPeriodo({ periodo }));
  }

  setSearchTerm(searchTerm: string) {
    this.dispatch(setSearchTerm({ searchTerm }));
  }

  loadBonificaciones(periodo: Periodo, cartera: string) {
    this.dispatch(loadBonificaciones({ periodo, cartera }));
  }

  save(bonificacion: Partial<NotaDeCredito>) {
    this.dispatch(saveBonificacion({ bonificacion }));
  }

  edit(nota: Partial<NotaDeCredito>, cartera: Cartera) {
    this.router.navigate([
      cartera.descripcion.toLowerCase(),
      'bonificaciones',
      'edit',
      nota.id,
    ]);
  }
}
