import { Injectable } from '@angular/core';

import { createEffect, Actions, ofType } from '@ngrx/effects';
import { DataPersistence, pessimisticUpdate } from '@nrwl/angular';

import * as fromCobros from './cobros.reducer';
import * as CobrosActions from './cobros.actions';
import { CobroService } from '../services/cobro.service';

import { map, tap } from 'rxjs/operators';

import { TdDialogService } from '@covalent/core/dialogs';

@Injectable()
export class CobrosEffects {
  loadCobros$ = createEffect(() =>
    this.dataPersistence.fetch(CobrosActions.loadCobros, {
      run: (
        action: ReturnType<typeof CobrosActions.loadCobros>,
        state: fromCobros.CobrosPartialState
      ) => {
        const disponibles = state[fromCobros.COBROS_FEATURE_KEY].disponibles;
        // console.log('Disponbles: ', disponibles);
        return this.service.list(action.periodo, action.cartera).pipe(
          map((cobros) =>
            CobrosActions.loadCobrosSuccess({
              cobros,
            })
          )
        );
      },

      onError: (action: ReturnType<typeof CobrosActions.loadCobros>, error) => {
        console.error('Error', error);
        return CobrosActions.loadCobrosFailure({ error });
      },
    })
  );

  aplicar$ = createEffect(() =>
    this.dataPersistence.pessimisticUpdate(CobrosActions.aplicarCobros, {
      run: (
        action: ReturnType<typeof CobrosActions.aplicarCobros>,
        state: fromCobros.CobrosPartialState
      ) => {
        return this.service.aplicarCobros(action.cobro, action.cuentas).pipe(
          map((cobro) =>
            CobrosActions.upsertCobro({
              cobro,
            })
          )
        );
      },
      onError: (
        action: ReturnType<typeof CobrosActions.aplicarCobros>,
        error
      ) => {
        console.error('Error', error);
        return CobrosActions.aplicarCobrosFail({ error });
      },
    })
  );

  eliminarAplicacion$ = createEffect(() =>
    this.dataPersistence.pessimisticUpdate(CobrosActions.eliminarAplicacion, {
      run: (
        action: ReturnType<typeof CobrosActions.eliminarAplicacion>,
        state: fromCobros.CobrosPartialState
      ) => {
        const id = action.id;
        const aplicaciones = [action.aplicacionId];
        return this.service.eliminarAplicacion(id, aplicaciones).pipe(
          map((cobro) =>
            CobrosActions.upsertCobro({
              cobro,
            })
          )
        );
      },
      onError: (
        action: ReturnType<typeof CobrosActions.eliminarAplicacion>,
        error
      ) => {
        console.error('Error', error);
        return CobrosActions.eliminarAplicacionFail({ error });
      },
    })
  );
  generarRecibo$ = createEffect(() =>
    this.dataPersistence.pessimisticUpdate(CobrosActions.generarRecibo, {
      run: (
        action: ReturnType<typeof CobrosActions.generarRecibo>,
        state: fromCobros.CobrosPartialState
      ) => {
        const id = action.id;
        return this.service.generarRecibo(id).pipe(
          map((cobro) =>
            CobrosActions.generarReciboSuccess({
              cobro,
            })
          )
        );
      },
      onError: (
        action: ReturnType<typeof CobrosActions.generarRecibo>,
        error
      ) => {
        console.error('Error', error);
        return CobrosActions.generarReciboFail({ error });
      },
    })
  );

  error$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CobrosActions.generarReciboFail),
        map(({ error }) => error),
        tap((response) => {
          const message = response.error ? response.error.message : 'Error';
          const message2 = response.message ? response.message : '';
          console.error('API Call error: ', response);
          this.dialogService.openAlert({
            message: `${response.status} ${message} ${message2}`,
            title: `Error ${response.status}`,
            closeButton: 'Cerrar',
          });
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private service: CobroService,
    private dataPersistence: DataPersistence<fromCobros.CobrosPartialState>,
    private dialogService: TdDialogService
  ) {}
}
