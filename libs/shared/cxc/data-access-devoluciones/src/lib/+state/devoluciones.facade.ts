import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { select, Store, Action } from '@ngrx/store';
import * as fromDevoluciones from './devoluciones.reducer';
import * as DevolucionesSelectors from './devoluciones.selectors';
import * as DevolucionesActions from './devoluciones.actions';

import { CXCFacade } from '@nx-papelsa/shared/cxc/data-acces';
import {
  Periodo,
  Cartera,
  NotaDeCredito,
} from '@nx-papelsa/shared/utils/core-models';
import { Update } from '@ngrx/entity';
import { DevolucionesEntity } from './devoluciones.models';

@Injectable()
export class DevolucionesFacade {
  cartera$ = this.cxcFacade.cartera$;
  loaded$ = this.store.pipe(
    select(DevolucionesSelectors.getDevolucionesLoaded)
  );
  loading$ = this.store.pipe(
    select(DevolucionesSelectors.getDevolucionesLoading)
  );
  search$ = this.store.pipe(
    select(DevolucionesSelectors.getDevolucionesSearchTerm)
  );
  periodo$ = this.store.pipe(
    select(DevolucionesSelectors.getDevolucionesPeriodo)
  );

  allDevoluciones$ = this.store.pipe(
    select(DevolucionesSelectors.getAllDevoluciones)
  );

  selectedDevolucion$ = this.store.pipe(
    select(DevolucionesSelectors.getSelected)
  );

  constructor(
    private store: Store<fromDevoluciones.DevolucionesPartialState>,
    private cxcFacade: CXCFacade,
    private router: Router
  ) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }

  cambiarPeriodo(periodo: Periodo) {
    this.dispatch(DevolucionesActions.setPeriodoDeDevoluciones({ periodo }));
  }

  setSearchTerm(searchTerm: string) {
    this.dispatch(
      DevolucionesActions.setDevolucionesSearchTerm({ searchTerm })
    );
  }

  loadDevoluciones(periodo?: Periodo, cartera?: Cartera) {
    this.dispatch(DevolucionesActions.loadDevoluciones({}));
  }

  save(devolucion: Partial<NotaDeCredito>) {
    this.dispatch(DevolucionesActions.saveDevolucion({ devolucion }));
  }

  update(update: Update<DevolucionesEntity>) {
    this.dispatch(DevolucionesActions.updateDevolucion({ update }));
  }

  edit(nota: Partial<NotaDeCredito>, cartera: Cartera) {
    this.router.navigate([
      cartera.descripcion.toLowerCase(),
      'devoluciones',
      'edit',
      nota.id,
    ]);
  }

  cancelar(devolucion: NotaDeCredito, motivo: string) {
    console.log('Cancelando Devolucion: ', devolucion.id);
    this.dispatch(
      DevolucionesActions.cancelarDevolucion({ devolucion, motivo })
    );
  }
  delete(devolucion: NotaDeCredito) {
    this.dispatch(DevolucionesActions.deleteDevolucion({ devolucion }));
  }

  timbrar(devolucion: NotaDeCredito) {
    this.dispatch(DevolucionesActions.timbrarDevolucion({ devolucion }));
  }

  timbrarV4(devolucion: NotaDeCredito) {
    console.log('Ejecutando el facade de nota de credito para timbrar');
    this.dispatch(DevolucionesActions.timbrarDevolucionV4({ devolucion }));
  }

  aplicar(devolucion: NotaDeCredito) {
    this.dispatch(DevolucionesActions.aplicar({ devolucion }));
  }
}
