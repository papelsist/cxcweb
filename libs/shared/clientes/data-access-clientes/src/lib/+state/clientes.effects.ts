import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';

import * as fromClientes from './clientes.reducer';
import * as ClientesActions from './clientes.actions';
import { ClientesService } from '../services/clientes.service';
import { map } from 'rxjs/operators';

@Injectable()
export class ClientesEffects {
  loadClientes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientesActions.loadClientes),
      fetch({
        run: (action) => {
          // Your custom service 'load' logic goes here. For now just return a success action...
          // return ClientesActions.loadClientesSuccess({ clientes: [] });
          return this.service.list().pipe(
            map((clientes) =>
              ClientesActions.loadClientesSuccess({
                clientes,
              })
            )
          );
        },

        onError: (action, error) => {
          console.error('Error', error);
          return ClientesActions.loadClientesFailure({ error });
        },
      })
    )
  );

  constructor(private actions$: Actions, private service: ClientesService) {}

  ngrxOnInitEffects(): Action {
    console.log('Inicializando clientes effects');
    return ClientesActions.loadClientes();
  }
}
