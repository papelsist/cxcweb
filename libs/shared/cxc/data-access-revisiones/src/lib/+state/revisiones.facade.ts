import { Injectable } from '@angular/core';

import { select, Store, Action } from '@ngrx/store';

import * as fromRevisiones from './revisiones.reducer';
import * as RevisionesSelectors from './revisiones.selectors';
import * as RevisionesActions from './revisiones.actions';
import { VentaCredito } from '@nx-papelsa/shared/utils/core-models';
import { RevisionesEntity } from './revisiones.models';
import { RevisionesService } from '../services/revisiones.service';

@Injectable()
export class RevisionesFacade {
  loaded$ = this.store.pipe(select(RevisionesSelectors.getRevisionesLoaded));
  loading$ = this.store.pipe(select(RevisionesSelectors.getRevisionesLoading));
  allRevisiones$ = this.store.pipe(
    select(RevisionesSelectors.getAllRevisiones)
  );
  search$ = this.store.pipe(
    select(RevisionesSelectors.getRevisionesSearchTerm)
  );
  selectedRevisiones$ = this.store.pipe(
    select(RevisionesSelectors.getSelected)
  );

  allSelectedIds$ = this.store.pipe(select(RevisionesSelectors.getSelection));
  allSelected$ = this.store.pipe(
    select(RevisionesSelectors.getSelectedRevisiones)
  );

  porRecibir$ = this.store.pipe(select(RevisionesSelectors.getPorRecibir));
  recibidas$ = this.store.pipe(select(RevisionesSelectors.getRecibidas));
  recibidasCancelables$ = this.store.pipe(
    select(RevisionesSelectors.getRecibidasCancelables)
  );
  porRevisar$ = this.store.pipe(select(RevisionesSelectors.getPorRevisar));
  revisadas$ = this.store.pipe(select(RevisionesSelectors.getPorRevisadas));
  ultimaActualizacion$ = this.store.pipe(
    select(RevisionesSelectors.getUltimaActualizacion)
  );

  constructor(private store: Store<fromRevisiones.RevisionesPartialState>) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
  setSearchTerm(searchTerm: string) {
    this.dispatch(RevisionesActions.setSearchTerm({ searchTerm }));
  }

  loadRevisiones() {
    this.dispatch(RevisionesActions.loadRevisiones());
  }

  actualizarRevisiones() {
    this.dispatch(RevisionesActions.actualizarRevisiones());
  }
  registrarRecepcion(recibidas: boolean, facturas: string[]) {
    this.dispatch(
      RevisionesActions.registrarRecepcion({ recibidas, facturas: facturas })
    );
  }

  registrarRevision(revisada: boolean, facturas: string[]) {
    this.dispatch(RevisionesActions.registrarRevision({ revisada, facturas }));
  }

  batchUpdate(command: {
    template: Partial<RevisionesEntity>;
    facturas: string[];
  }) {
    this.dispatch(RevisionesActions.batchUpdateRevisiones(command));
  }

  setSelection(facturas: RevisionesEntity[]) {
    const ids = facturas.map((item) => item.id);
    this.dispatch(RevisionesActions.selectRevisiones({ ids }));
  }
}
