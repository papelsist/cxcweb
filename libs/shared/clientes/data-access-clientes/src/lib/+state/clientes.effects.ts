import { Injectable } from '@angular/core';

import { createEffect, Actions, ofType } from '@ngrx/effects';
// import { ROUTER_NAVIGATION, ROUTER_REQUEST } from '@ngrx/router-store';
import { fetch } from '@nrwl/angular';

import * as fromClientes from './clientes.reducer';
import * as ClientesActions from './clientes.actions';
import { ClientesService } from '../services/clientes.service';
import { map, tap } from 'rxjs/operators';
import { TdDialogService } from '@covalent/core/dialogs';

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

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientesActions.updateCliente),
      fetch({
        run: ({ update }) => {
          return this.service.update(update).pipe(
            map((cliente) =>
              ClientesActions.updateClienteSuccess({
                cliente,
              })
            )
          );
        },

        onError: (action, error) => {
          return ClientesActions.updateClienteFail({ error });
        },
      })
    )
  );

  updateCredito$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientesActions.updateClienteCredito),
      fetch({
        run: ({ clienteId, credito }) => {
          return this.service.updateCredito(clienteId, credito).pipe(
            map((res) =>
              ClientesActions.updateClienteCreditoSuccess({
                credito: res,
              })
            )
          );
        },

        onError: (action, error) => {
          return ClientesActions.updateClienteCreditoFail({ error });
        },
      })
    )
  );

  updateMedio$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientesActions.updateMedioDeContacto),
      fetch({
        run: ({ clienteId, medio }) => {
          return this.service.updateMedio(clienteId, medio).pipe(
            map((res) =>
              ClientesActions.updateMedioDeContactoSuccess({
                medio: res,
              })
            )
          );
        },

        onError: (action, error) => {
          return ClientesActions.updateMedioDeContactoFail({ error });
        },
      })
    )
  );

  errors$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ClientesActions.loadClientesFailure,
          ClientesActions.updateClienteFail,
          ClientesActions.updateMedioDeContactoFail
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

  /*
  clientesSearch$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ROUTER_NAVIGATION),
        map(({ payload: { routerState } }) => routerState),
        filter((state: any) => state.url === '/clientes'),
        tap((state: any) => {
          console.log('Nav to :', state.url);
        })
      ),
    { dispatch: false }
  );
  */

  constructor(
    private actions$: Actions,
    private service: ClientesService,
    private dialogService: TdDialogService
  ) {}

  /*
  ngrxOnInitEffects(): Action {
    console.log('Inicializando clientes effects');
    return ClientesActions.loadClientes();
  }
  */
}
