import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { NxModule, DataPersistence } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';

import { FacturasEffects } from './facturas.effects';
import * as FacturasActions from './facturas.actions';

describe('FacturasEffects', () => {
  let actions: Observable<any>;
  let effects: FacturasEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        FacturasEffects,
        DataPersistence,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.get(FacturasEffects);
  });

  describe('loadFacturas$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: FacturasActions.loadFacturas() });

      const expected = hot('-a-|', {
        a: FacturasActions.loadFacturasSuccess({ facturas: [] }),
      });

      expect(effects.loadFacturas$).toBeObservable(expected);
    });
  });
});
