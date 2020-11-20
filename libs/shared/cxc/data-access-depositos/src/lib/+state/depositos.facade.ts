import { Injectable } from '@angular/core';

import { select, Store, Action } from '@ngrx/store';

import * as fromDepositos from './depositos.reducer';
import * as DepositosSelectors from './depositos.selectors';

@Injectable()
export class DepositosFacade {
  loaded$ = this.store.pipe(select(DepositosSelectors.getDepositosLoaded));
  allDepositos$ = this.store.pipe(select(DepositosSelectors.getAllDepositos));
  selectedDepositos$ = this.store.pipe(select(DepositosSelectors.getSelected));

  constructor(private store: Store<fromDepositos.DepositosPartialState>) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
