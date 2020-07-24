import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { NxModule, DataPersistence } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';

import { BonificacionesEffects } from './bonificaciones.effects';
import * as BonificacionesActions from './bonificaciones.actions';

describe('BonificacionesEffects', () => {
  let actions: Observable<any>;
  let effects: BonificacionesEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        BonificacionesEffects,
        DataPersistence,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.get(BonificacionesEffects);
  });

  describe('loadBonificaciones$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: BonificacionesActions.loadBonificaciones() });

      const expected = hot('-a-|', {
        a: BonificacionesActions.loadBonificacionesSuccess({
          bonificaciones: [],
        }),
      });

      expect(effects.loadBonificaciones$).toBeObservable(expected);
    });
  });
});
