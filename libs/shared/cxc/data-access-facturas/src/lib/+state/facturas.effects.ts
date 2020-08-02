import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';

import * as fromFacturas from './facturas.reducer';
import * as FacturasActions from './facturas.actions';

@Injectable()
export class FacturasEffects {
  loadFacturas$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FacturasActions.loadFacturas),
      fetch({
        run: (action) => {
          // Your custom service 'load' logic goes here. For now just return a success action...
          return FacturasActions.loadFacturasSuccess({ facturas: [] });
        },

        onError: (action, error) => {
          console.error('Error', error);
          return FacturasActions.loadFacturasFailure({ error });
        },
      })
    )
  );

  constructor(private actions$: Actions) {}
}
