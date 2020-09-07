import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';

import * as fromRevisiones from './revisiones.reducer';
import * as RevisionesActions from './revisiones.actions';
import { RevisionesService } from '../services/revisiones.service';
import { map, tap } from 'rxjs/operators';

import { TdDialogService } from '@covalent/core/dialogs';

@Injectable()
export class RevisionesEffects {
  loadRevisiones$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RevisionesActions.loadRevisiones),
      fetch({
        run: (action) => {
          return this.service.list().pipe(
            map((revisiones) =>
              RevisionesActions.loadRevisionesSuccess({
                revisiones,
              })
            )
          );
        },

        onError: (action, error) => {
          console.error('Error cargando revisiones', error);
          return RevisionesActions.loadRevisionesFailure({ error });
        },
      })
    )
  );

  actualizarRevisiones$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RevisionesActions.actualizarRevisiones),
      fetch({
        run: () => {
          return this.service.recalcular().pipe(
            map((revisiones) =>
              RevisionesActions.actualizarRevisionesSuccess({
                revisiones,
              })
            )
          );
        },

        onError: (action, error) => {
          console.error('Error Actulizando  revisiones', error);
          return RevisionesActions.actualizarRevisionesFail({ error });
        },
      })
    )
  );

  registrarRecepcion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RevisionesActions.registrarRecepcion),
      fetch({
        run: ({ recibidas, facturas }) => {
          return this.service.registrarRecepcionCxc(recibidas, facturas).pipe(
            map((revisiones) =>
              RevisionesActions.registrarRecepcionSuccess({
                revisiones,
              })
            )
          );
        },
        onError: (action, error) => {
          console.error('Error Actulizando  revisiones', error);
          return RevisionesActions.registrarRecepcionFail({ error });
        },
      })
    )
  );

  registrarRevision$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RevisionesActions.registrarRevision),
      fetch({
        run: ({ revisada, facturas }) => {
          return this.service.registrarRevision(revisada, facturas).pipe(
            map((revisiones) =>
              RevisionesActions.registrarRevisionSuccess({
                revisiones,
              })
            )
          );
        },
        onError: (action, error) => {
          console.error('Error Actulizando  revisiones', error);
          return RevisionesActions.registrarRevisionFail({ error });
        },
      })
    )
  );
  batchUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RevisionesActions.batchUpdateRevisiones),
      fetch({
        run: ({ template, facturas }) => {
          return this.service.batchUpdate({ template, facturas }).pipe(
            map((revisiones) =>
              RevisionesActions.batchUpdateRevisionesSuccess({
                revisiones,
              })
            )
          );
        },
        onError: (action, error) => {
          console.error('Error Actulizando  revisiones', error);
          return RevisionesActions.batchUpdateRevisionesFail({ error });
        },
      })
    )
  );

  errors$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          RevisionesActions.loadRevisionesFailure,
          RevisionesActions.actualizarRevisionesFail,
          RevisionesActions.registrarRecepcionFail,
          RevisionesActions.batchUpdateRevisionesFail
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
    private service: RevisionesService,
    private dialogService: TdDialogService
  ) {}
}
