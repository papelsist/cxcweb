import { Injectable } from '@angular/core';

import { createEffect, Actions, ofType } from '@ngrx/effects';
import { DataPersistence, pessimisticUpdate } from '@nrwl/angular';

import * as fromCobros from './cobros.reducer';
import * as CobrosActions from './cobros.actions';
import { CobroService } from '../services/cobro.service';

import { map, tap } from 'rxjs/operators';

import { TdDialogService } from '@covalent/core/dialogs';
import { Cartera } from '@nx-papelsa/shared/utils/core-models';
import { persistCobrosState } from './cobros.utils';
import { generarReciboV4 } from './cobros.actions';

@Injectable()
export class CobrosEffects {
  loadCobros$ = createEffect(() =>
    this.dataPersistence.fetch(CobrosActions.loadCobros, {
      run: (
        action: ReturnType<typeof CobrosActions.loadCobros>,
        state: {
          cobranza: { cartera: Cartera };
          cobros: fromCobros.State;
        }
        //state: fromCobros.CobrosPartialState
      ) => {
        const {
          cobranza: { cartera },
          cobros: { periodo, disponibles, porTimbrar },
        } = state;
        persistCobrosState({ disponibles, porTimbrar });
        return this.service
          .list(periodo, cartera.clave, disponibles, porTimbrar)
          .pipe(
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

  generarReciboV4$ = createEffect(() =>
    this.dataPersistence.pessimisticUpdate(CobrosActions.generarReciboV4, {
      run: (
        action: ReturnType<typeof CobrosActions.generarReciboV4>,
        state: fromCobros.CobrosPartialState
      ) => {
        const id = action.id;
        return this.service.generarReciboV4(id).pipe(
          map((cobro) =>
            CobrosActions.generarReciboV4Success({
              cobro,
            })
          )
        );
      },
      onError: (
        action: ReturnType<typeof CobrosActions.generarReciboV4>,
        error
      ) => {
        console.error('Error', error);
        return CobrosActions.generarReciboV4Fail({ error });
      },
    })
  );

  cancelarRecibo$ = createEffect(() =>
    this.dataPersistence.pessimisticUpdate(CobrosActions.cancelarRecibo, {
      run: (
        action: ReturnType<typeof CobrosActions.cancelarRecibo>,
        state: fromCobros.CobrosPartialState
      ) => {
        const id = action.id;
        return this.service.cancelarRecibo(id, action.motivo).pipe(
          map((cobro) =>
            CobrosActions.cancelarReciboSuccess({
              cobro,
            })
          )
        );
      },
      onError: (
        action: ReturnType<typeof CobrosActions.cancelarRecibo>,
        error
      ) => {
        console.error('Error', error);
        return CobrosActions.cancelarReciboFail({ error });
      },
    })
  );

  saldar$ = createEffect(() =>
    this.dataPersistence.pessimisticUpdate(CobrosActions.saldarCobro, {
      run: (
        action: ReturnType<typeof CobrosActions.saldarCobro>,
        state: fromCobros.CobrosPartialState
      ) => {
        return this.service.saldar(action.id).pipe(
          map((cobro) =>
            CobrosActions.saldarCobroSuccess({
              cobro,
            })
          )
        );
      },
      onError: (
        action: ReturnType<typeof CobrosActions.saldarCobro>,
        error
      ) => {
        console.error('Error', error);
        return CobrosActions.saldarCobroFail({ error });
      },
    })
  );

  cambiarPeriodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CobrosActions.setPeriodo),
      map(() => CobrosActions.loadCobros({}))
    )
  );

  toggleDisponibles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CobrosActions.toggleDisponibles),
      map((a) => CobrosActions.loadCobros({}))
    )
  );
  togglePorTimbrar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CobrosActions.togglePorTimbrar),
      map((a) => CobrosActions.loadCobros({}))
    )
  );

  error$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          CobrosActions.generarReciboFail,
          CobrosActions.saldarCobroFail,
          CobrosActions.aplicarCobrosFail,
          CobrosActions.eliminarAplicacionFail,
          CobrosActions.cancelarReciboFail
        ),
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
