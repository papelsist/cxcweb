import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';

import * as fromDevoluciones from './devoluciones.reducer';
import * as DevolucionesActions from './devoluciones.actions';

@Injectable()
export class DevolucionesEffects {
  loadDevoluciones$ = createEffect(() =>
    this.dataPersistence.fetch(DevolucionesActions.loadDevoluciones, {
      run: (
        action: ReturnType<typeof DevolucionesActions.loadDevoluciones>,
        state: fromDevoluciones.DevolucionesPartialState
      ) => {
        // Your custom service 'load' logic goes here. For now just return a success action...
        return DevolucionesActions.loadDevolucionesSuccess({
          devoluciones: [],
        });
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

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<
      fromDevoluciones.DevolucionesPartialState
    >
  ) {}
}
