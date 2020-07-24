import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';

import { fetch } from '@nrwl/angular';

import { tap, switchMap, map } from 'rxjs/operators';

import * as fromBonificaciones from './bonificaciones.reducer';
import * as BonificacionesActions from './bonificaciones.actions';
import {
  Periodo,
  resolveCarteraPath,
} from '@nx-papelsa/shared/utils/core-models';
import { BonificacionesService } from '../services/bonificaciones.service';
import { Router } from '@angular/router';

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

  cambiarPeriodo$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BonificacionesActions.setPeriodo),
        tap(({ periodo }) =>
          Periodo.saveOnStorage(
            fromBonificaciones.BONIFICACIONES_STORAGE_PERIODO_KEY,
            periodo
          )
        )
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private service: BonificacionesService,
    private router: Router
  ) {}
}
