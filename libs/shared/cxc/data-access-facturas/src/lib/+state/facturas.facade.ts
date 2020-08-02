import { Injectable } from '@angular/core';

import { select, Store, Action } from '@ngrx/store';

import * as fromFacturas from './facturas.reducer';
import * as FacturasSelectors from './facturas.selectors';

@Injectable()
export class FacturasFacade {
  loaded$ = this.store.pipe(select(FacturasSelectors.getFacturasLoaded));
  allFacturas$ = this.store.pipe(select(FacturasSelectors.getAllFacturas));
  selectedFacturas$ = this.store.pipe(select(FacturasSelectors.getSelected));

  constructor(private store: Store<fromFacturas.FacturasPartialState>) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
