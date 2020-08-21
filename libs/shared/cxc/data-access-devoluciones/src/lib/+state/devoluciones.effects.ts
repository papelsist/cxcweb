import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { createEffect, Actions, ofType } from '@ngrx/effects';
import { DataPersistence, pessimisticUpdate } from '@nrwl/angular';

import { map, tap } from 'rxjs/operators';

import * as fromDevoluciones from './devoluciones.reducer';
import * as DevolucionesActions from './devoluciones.actions';

import { Cartera } from '@nx-papelsa/shared/utils/core-models';
import { DevolucionesService } from '@nx-papelsa/shared/cxc/data-acces';

import { TdDialogService } from '@covalent/core/dialogs';

@Injectable()
export class DevolucionesEffects {
  loadDevoluciones$ = createEffect(() =>
    this.dataPersistence.fetch(DevolucionesActions.loadDevoluciones, {
      run: (
        action: ReturnType<typeof DevolucionesActions.loadDevoluciones>,
        state: {
          cobranza: { cartera: Cartera };
          devoluciones: fromDevoluciones.State;
        }
      ) => {
        const {
          cobranza: { cartera },
          devoluciones: { periodo },
        } = state;
        return this.service.list(periodo, cartera.clave).pipe(
          map((devoluciones) =>
            DevolucionesActions.loadDevolucionesSuccess({
              devoluciones,
            })
          )
        );
      },

      onError: (
        action: ReturnType<typeof DevolucionesActions.loadDevoluciones>,
        error
      ) => {
        console.error('Error', error);
        return DevolucionesActions.loadDevolucionesFailure({ error });
      },
    })
  );

  cambiarPeriodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DevolucionesActions.setPeriodoDeDevoluciones),
      map(() => DevolucionesActions.loadDevoluciones({}))
    )
  );

  cancelar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DevolucionesActions.cancelarDevolucion),
      pessimisticUpdate({
        run: ({ devolucion, motivo }) => {
          return this.service.cancelar(devolucion, motivo).pipe(
            map((res) =>
              DevolucionesActions.cancelarDevolucionSuccess({
                devolucion: res,
              })
            )
          );
        },

        onError: (action, error) => {
          console.error('Error cancelando bonificacion', error);
          return DevolucionesActions.cancelarDevolucionFail({ error });
        },
      })
    )
  );

  errors$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          // DevolucionesActions.aplicarFail,
          // DevolucionesActions.deleteDevolucionFail,
          DevolucionesActions.loadDevolucionesFailure,
          // DevolucionesActions.saveDevolucionFail,
          // DevolucionesActions.updateDevolucionFail,
          DevolucionesActions.cancelarDevolucionFail
          // DevolucionesActions.timbrarDevolucionFail
        ),
        map(({ error }) => error),
        tap((response) => {
          const message = response.error ? response.error.message : 'Error';
          const message2 = response.message ? response.message : '';
          console.error('API Call error: ', response);
          this.dialogService.openAlert({
            message: `Status code: ${response.status} ${message} ${message2}`,
            title: `Error ${response.status}`,
            closeButton: 'Cerrar',
          });
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<
      fromDevoluciones.DevolucionesPartialState
    >,
    private service: DevolucionesService,
    private router: Router,
    private dialogService: TdDialogService
  ) {}
}
