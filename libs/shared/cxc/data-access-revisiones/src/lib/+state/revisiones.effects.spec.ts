import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { NxModule, DataPersistence } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';

import { RevisionesEffects } from './revisiones.effects';
import * as RevisionesActions from './revisiones.actions';

describe('RevisionesEffects', () => {
  let actions: Observable<any>;
  let effects: RevisionesEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        RevisionesEffects,
        DataPersistence,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.get(RevisionesEffects);
  });

  describe('loadRevisiones$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: RevisionesActions.loadRevisiones() });

      const expected = hot('-a-|', {
        a: RevisionesActions.loadRevisionesSuccess({ revisiones: [] }),
      });

      expect(effects.loadRevisiones$).toBeObservable(expected);
    });
  });
});
