import { Injectable } from '@angular/core';

import { createEffect, Actions, ofType } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import * as fromCobros from './cobros.reducer';
import * as CobrosActions from './cobros.actions';
import { CobroService } from '../services/cobro.service';

import { map } from 'rxjs/operators';

@Injectable()
export class CobrosEffects {
  loadCobros$ = createEffect(() =>
    this.dataPersistence.fetch(CobrosActions.loadCobros, {
      run: (
        action: ReturnType<typeof CobrosActions.loadCobros>,
        state: fromCobros.CobrosPartialState
      ) => {
        const disponibles = state[fromCobros.COBROS_FEATURE_KEY].disponibles;
        console.log('Disponbles: ', disponibles);
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

  constructor(
    private actions$: Actions,
    private service: CobroService,
    private dataPersistence: DataPersistence<fromCobros.CobrosPartialState>
  ) {}
}
