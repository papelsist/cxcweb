import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { NxModule, DataPersistence } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';

import { CobrosEffects } from './cobros.effects';
import * as CobrosActions from './cobros.actions';

describe('CobrosEffects', () => {
  let actions: Observable<any>;
  let effects: CobrosEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        CobrosEffects,
        DataPersistence,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.get(CobrosEffects);
  });

  describe('loadCobros$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: CobrosActions.loadCobros() });

      const expected = hot('-a-|', {
        a: CobrosActions.loadCobrosSuccess({ cobros: [] }),
      });

      expect(effects.loadCobros$).toBeObservable(expected);
    });
  });
});
