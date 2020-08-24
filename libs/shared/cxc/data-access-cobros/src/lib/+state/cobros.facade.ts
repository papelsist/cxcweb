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

import {
  Periodo,
  Cartera,
  Cobro,
  AplicacionDeCobro,
  CuentaPorCobrarDTO,
} from '@nx-papelsa/shared/utils/core-models';

import { CXCFacade } from '@nx-papelsa/shared/cxc/data-acces';
import * as CobrosActions from '../+state/cobros.actions';

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

  loadCobros(periodo?: Periodo, cartera?: string) {
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

  aplicar(cobro: Partial<Cobro>, facturas: Partial<CuentaPorCobrarDTO>[]) {
    const command = {
      cobro: cobro.id,
      cuentas: facturas.map((item) => item.id),
    };
    this.dispatch(
      CobrosActions.aplicarCobros({ cobro: cobro.id, cuentas: command.cuentas })
    );
  }

  eliminarAplicacion(
    cobro: Partial<Cobro>,
    aplicacion: Partial<AplicacionDeCobro>
  ) {
    const cob = {
      id: cobro.id,
      aplicaciones: cobro.aplicaciones.filter(
        (item) => item.id !== aplicacion.id
      ),
    };
    console.log('Cobro actualizado: ', cob);

    this.dispatch(
      CobrosActions.eliminarAplicacion({
        id: cobro.id,
        aplicacionId: aplicacion.id,
      })
    );
  }

  generarRecibo(cobro: Partial<Cobro>) {
    this.dispatch(
      CobrosActions.generarRecibo({
        id: cobro.id,
      })
    );
  }
}
