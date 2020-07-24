import { Injectable } from '@angular/core';

import { select, Store, Action } from '@ngrx/store';

import * as fromCXC from './cxc.reducer';
import { getCartera } from './cxc.selectors';
import { setCartera } from './cxc.actions';

import { Cartera } from '@nx-papelsa/shared/utils/core-models';

@Injectable()
export class CXCFacade {
  cartera$ = this.store.pipe(select(getCartera));

  constructor(private store: Store<fromCXC.CXCState>) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }

  cambiarCartera(cartera: Cartera) {
    this.dispatch(setCartera({ cartera }));
  }
}
