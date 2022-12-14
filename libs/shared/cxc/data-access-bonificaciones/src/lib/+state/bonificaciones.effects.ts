import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';

import { fetch, pessimisticUpdate } from '@nrwl/angular';

import { tap, switchMap, map, withLatestFrom } from 'rxjs/operators';

import { CXCFacade } from '@nx-papelsa/shared/cxc/data-acces';
import * as fromBonificaciones from './bonificaciones.reducer';

import * as BonificacionesActions from './bonificaciones.actions';
import {
  Periodo,
  resolveCarteraPath,
} from '@nx-papelsa/shared/utils/core-models';
import { BonificacionesService } from '../services/bonificaciones.service';
import { Router } from '@angular/router';
import { TdDialogService } from '@covalent/core/dialogs';
// import { Store } from '@ngrx/store';

@Injectable()
export class BonificacionesEffects {
  loadBonificaciones$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BonificacionesActions.loadBonificaciones),
      fetch({
        run: ({ periodo, cartera }) => {
          // Your custom service 'load' logic goes here. For now just return a success action...
          // return BonificacionesActions.loadBonificacionesSuccess({
          //   bonificaciones: [],
          // });
          return this.service.list(periodo, cartera, 'BONIFICACION').pipe(
            map((bonificaciones) =>
              BonificacionesActions.loadBonificacionesSuccess({
                bonificaciones,
              })
            )
          );
        },

        onError: (action, error) => {
          console.error('Error cargando Bonificaciones', error);
          return BonificacionesActions.loadBonificacionesFailure({ error });
        },
      })
    )
  );

  saveBonificaciones$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BonificacionesActions.saveBonificacion),
      fetch({
        run: ({ bonificacion }) => {
          return this.service.save(bonificacion).pipe(
            map((res) =>
              BonificacionesActions.saveBonificacionSuccess({
                bonificacion: res,
              })
            )
          );
        },

        onError: (action, error) => {
          console.error('Error salvando Bonificacion', error);
          return BonificacionesActions.saveBonificacionFail({ error });
        },
      })
    )
  );

  saveSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BonificacionesActions.saveBonificacionSuccess),
        tap(({ bonificacion: { id, tipoCartera } }) => {
          const start = resolveCarteraPath(tipoCartera);
          this.router.navigate([start, 'bonificaciones', 'edit', id]);
        })
      ),
    { dispatch: false }
  );

  updateBonificaciones$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BonificacionesActions.updateBonificacion),
      fetch({
        run: ({ update }) => {
          return this.service.update(update).pipe(
            map((bonificacion) =>
              BonificacionesActions.updateBonificacionSuccess({
                bonificacion,
              })
            )
          );
        },

        onError: (action, error) => {
          console.error('Error actualizando Bonificacion', error);
          return BonificacionesActions.updateBonificacionFail({ error });
        },
      })
    )
  );

  timbrar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BonificacionesActions.timbrarBonificacion),
      pessimisticUpdate({
        run: ({ bonificacion }) => {
          return this.service.timbrar(bonificacion).pipe(
            map((res) =>
              BonificacionesActions.timbrarBonificacionSuccess({
                bonificacion: res,
              })
            )
          );
        },

        onError: (action, error) => {
          console.error('Error timbrando bonificacion', error);
          return BonificacionesActions.timbrarBonificacionFail({ error });
        },
      })
    )
  );

  timbrarV4$ = createEffect(() =>
  this.actions$.pipe(
    ofType(BonificacionesActions.timbrarBonificacionV4),
    pessimisticUpdate({
      run: ({ bonificacion }) => {
        return this.service.timbrarV4(bonificacion).pipe(
          map((res) =>
            BonificacionesActions.timbrarBonificacionV4Success({
              bonificacion: res,
            })
          )
        );
      },

      onError: (action, error) => {
        console.error('Error timbrando bonificacion', error);
        return BonificacionesActions.timbrarBonificacionV4Fail({ error });
      },
    })
  )
);

  aplicar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BonificacionesActions.aplicar),
      pessimisticUpdate({
        run: ({ bonificacion }) => {
          return this.service.aplicar(bonificacion).pipe(
            map((res) =>
              BonificacionesActions.aplicarSuccess({
                bonificacion: res,
              })
            )
          );
        },

        onError: (action, error) => {
          console.error('Error timbrando bonificacion', error);
          return BonificacionesActions.aplicarFail({ error });
        },
      })
    )
  );

  solicitarAutorizacion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BonificacionesActions.solicitarAutorizacion),
      pessimisticUpdate({
        run: ({ bonificacion }) => {
          return this.service.solicitarAutorizacion(bonificacion).pipe(
            map((res) =>
              BonificacionesActions.solicitarAutorizacionSuccess({
                bonificacion: res,
              })
            )
          );
        },

        onError: (action, error) => {
          console.error('Error timbrando bonificacion', error);
          return BonificacionesActions.solicitarAutorizacionFail({ error });
        },
      })
    )
  );

  cancelar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BonificacionesActions.cancelarBonificacion),
      pessimisticUpdate({
        run: ({ bonificacion, motivo }) => {
          return this.service.cancelar(bonificacion, motivo).pipe(
            map((res) =>
              BonificacionesActions.cancelarBonificacionSuccess({
                bonificacion: res,
              })
            )
          );
        },

        onError: (action, error) => {
          console.error('Error cancelando bonificacion', error);
          return BonificacionesActions.cancelarBonificacionFail({ error });
        },
      })
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BonificacionesActions.deleteBonificacion),
      pessimisticUpdate({
        run: ({ bonificacion }) => {
          return this.service.delete(bonificacion).pipe(
            map(() =>
              BonificacionesActions.deleteBonificacionSuccess({
                bonificacion,
              })
            )
          );
        },
        onError: (action, error) =>
          BonificacionesActions.deleteBonificacionFail({ error }),
      })
    )
  );

  deleteSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BonificacionesActions.deleteBonificacionSuccess),
        tap(({ bonificacion: { id, tipoCartera } }) => {
          const start = resolveCarteraPath(tipoCartera);
          this.router.navigate([start, 'bonificaciones']);
        })
      ),
    { dispatch: false }
  );

  cambiarPeriodo$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BonificacionesActions.setPeriodo),
        tap(({ periodo }) =>
          Periodo.saveOnStorage(
            fromBonificaciones.BONIFICACIONES_STORAGE_PERIODO_KEY,
            periodo
          )
        ),
        withLatestFrom(this.cxcFacade.cartera$),
        map(([action, cartera]) => {
          // console.log('Cartera: ', cartera);
          return BonificacionesActions.loadBonificaciones({
            periodo: action.periodo,
            cartera: cartera.clave,
          });
        })
        /*
        map(({ periodo }) =>
          BonificacionesActions.loadBonificaciones({ periodo, cartera: 'CRE' })
        )
        */
      ),
    { dispatch: true }
  );

  errors$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          BonificacionesActions.solicitarAutorizacionFail,
          BonificacionesActions.aplicarFail,
          BonificacionesActions.deleteBonificacionFail,
          BonificacionesActions.loadBonificacionesFailure,
          BonificacionesActions.saveBonificacionFail,
          BonificacionesActions.updateBonificacionFail,
          BonificacionesActions.cancelarBonificacionFail,
          BonificacionesActions.timbrarBonificacionFail
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
    private service: BonificacionesService,
    private router: Router,
    private dialogService: TdDialogService,
    private cxcFacade: CXCFacade
  ) {}
}
