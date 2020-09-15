import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { NxModule, DataPersistence } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';

import { DevolucionesEffects } from './devoluciones.effects';
import * as DevolucionesActions from './devoluciones.actions';

describe('DevolucionesEffects', () => {
  let actions: Observable<any>;
  let effects: DevolucionesEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        DevolucionesEffects,
        DataPersistence,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.get(DevolucionesEffects);
  });

  describe('loadDevoluciones$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: DevolucionesActions.loadDevoluciones() });

      const expected = hot('-a-|', {
        a: DevolucionesActions.loadDevolucionesSuccess({ devoluciones: [] }),
      });

      expect(effects.loadDevoluciones$).toBeObservable(expected);
    });
  });
});
