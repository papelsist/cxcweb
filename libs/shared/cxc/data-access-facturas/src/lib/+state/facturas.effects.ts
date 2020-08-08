import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch, DataPersistence } from '@nrwl/angular';

import * as fromFacturas from './facturas.reducer';
import { loadFacturas } from './facturas.actions';
import * as FacturasActions from './facturas.actions';
import { Periodo, Cartera } from '@nx-papelsa/shared/utils/core-models';
import { CxcService } from '@nx-papelsa/shared/cxc/data-acces';

import { map, tap } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class FacturasEffects {
  // loadFacturas$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(FacturasActions.loadFacturas),
  //     fetch({
  //       run: (action, state) => {
  //         // Your custom service 'load' logic goes here. For now just return a success action...
  //         console.log('Run with action: ', action);
  //         console.log('Run with state: ', state);
  //         return FacturasActions.loadFacturasSuccess({ facturas: [] });
  //       },

  //       onError: (action, error) => {
  //         console.error('Error', error);
  //         return FacturasActions.loadFacturasFailure({ error });
  //       },
  //     })
  //   )
  // );
  loadCobros$ = createEffect(() =>
    this.ds.fetch(FacturasActions.loadFacturas, {
      run: (
        action: ReturnType<typeof FacturasActions.loadFacturas>,
        state: { cobranza: { cartera: Cartera }; facturas: fromFacturas.State }
      ) => {
        const {
          cobranza: { cartera },
          facturas: { periodo },
        } = state;
        return this.service.facturas(periodo, cartera).pipe(
          map((facturas) =>
            FacturasActions.loadFacturasSuccess({
              facturas,
            })
          )
        );
      },

      onError: (
        action: ReturnType<typeof FacturasActions.loadFacturas>,
        error
      ) => {
        console.error('Error', error);
        const { message, status, url } = error;
        this.snack.open(
          `Error en el servidor: ${message} Statud: ${status} Api URL: ${url}`,
          'Cerrar',
          { duration: 10000 }
        );
        return FacturasActions.loadFacturasFailure({ error });
      },
    })
  );

  constructor(
    private actions$: Actions,
    private ds: DataPersistence<any>,
    private service: CxcService,
    private snack: MatSnackBar
  ) {}
}
