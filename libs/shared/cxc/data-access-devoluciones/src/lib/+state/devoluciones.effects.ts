import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { createEffect, Actions, ofType } from '@ngrx/effects';
import { DataPersistence, pessimisticUpdate } from '@nrwl/angular';

import { map, tap } from 'rxjs/operators';

import * as fromDevoluciones from './devoluciones.reducer';
import * as DevolucionesActions from './devoluciones.actions';

import {
  Cartera,
  resolveCarteraPath,
} from '@nx-papelsa/shared/utils/core-models';
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

  saveDevoluciones$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DevolucionesActions.saveDevolucion),
      pessimisticUpdate({
        run: ({ devolucion }) => {
          return this.service.save(devolucion).pipe(
            map((res) =>
              DevolucionesActions.saveDevolucionSuccess({
                devolucion: res,
              })
            )
          );
        },

        onError: (action, error) => {
          console.error('Error salvando Devolucion', error);
          return DevolucionesActions.saveDevolucionFail({ error });
        },
      })
    )
  );

  saveSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DevolucionesActions.saveDevolucionSuccess),
        tap(({ devolucion: { id, tipoCartera } }) => {
          const start = resolveCarteraPath(tipoCartera);
          this.router.navigate([start, 'devoluciones', 'edit', id]);
        })
      ),
    { dispatch: false }
  );

  updateDevoluciones$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DevolucionesActions.updateDevolucion),
      pessimisticUpdate({
        run: ({ update }) => {
          return this.service.update(update).pipe(
            map((devolucion) =>
              DevolucionesActions.updateDevolucionSuccess({
                devolucion,
              })
            )
          );
        },

        onError: (action, error) => {
          console.error('Error actualizando Devolucion', error);
          return DevolucionesActions.updateDevolucionFail({ error });
        },
      })
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
          console.error('Error cancelando devolucion', error);
          return DevolucionesActions.cancelarDevolucionFail({ error });
        },
      })
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DevolucionesActions.deleteDevolucion),
      pessimisticUpdate({
        run: ({ devolucion }) => {
          return this.service.delete(devolucion).pipe(
            map(() =>
              DevolucionesActions.deleteDevolucionSuccess({
                devolucion,
              })
            )
          );
        },
        onError: (action, error) =>
          DevolucionesActions.deleteDevolucionFail({ error }),
      })
    )
  );

  deleteSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DevolucionesActions.deleteDevolucionSuccess),
        tap(({ devolucion: { id, tipoCartera } }) => {
          const start = resolveCarteraPath(tipoCartera);
          this.router.navigate([start, 'devoluciones']);
        })
      ),
    { dispatch: false }
  );

  timbrar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DevolucionesActions.timbrarDevolucion),
      pessimisticUpdate({
        run: ({ devolucion }) => {
          return this.service.timbrar(devolucion).pipe(
            map((res) =>
              DevolucionesActions.timbrarDevolucionSuccess({
                devolucion: res,
              })
            )
          );
        },

        onError: (action, error) => {
          console.error('Error timbrando devolucion', error);
          return DevolucionesActions.timbrarDevolucionFail({ error });
        },
      })
    )
  );

  aplicar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DevolucionesActions.aplicar),
      pessimisticUpdate({
        run: ({ devolucion }) => {
          return this.service.aplicar(devolucion).pipe(
            map((res) =>
              DevolucionesActions.aplicarSuccess({
                devolucion: res,
              })
            )
          );
        },

        onError: (action, error) => {
          console.error('Error timbrando devolucion', error);
          return DevolucionesActions.aplicarFail({ error });
        },
      })
    )
  );

  errors$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          DevolucionesActions.aplicarFail,
          DevolucionesActions.loadDevolucionesFailure,
          DevolucionesActions.deleteDevolucionFail,
          DevolucionesActions.saveDevolucionFail,
          DevolucionesActions.updateDevolucionFail,
          DevolucionesActions.cancelarDevolucionFail,
          DevolucionesActions.timbrarDevolucionFail
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
