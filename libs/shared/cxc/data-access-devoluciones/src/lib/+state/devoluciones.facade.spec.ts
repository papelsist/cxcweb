import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { readFirst } from '@nrwl/angular/testing';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';

import { NxModule } from '@nrwl/angular';

import { DevolucionesEntity } from './devoluciones.models';
import { DevolucionesEffects } from './devoluciones.effects';
import { DevolucionesFacade } from './devoluciones.facade';

import * as DevolucionesSelectors from './devoluciones.selectors';
import * as DevolucionesActions from './devoluciones.actions';
import {
  DEVOLUCIONES_FEATURE_KEY,
  State,
  initialState,
  reducer,
} from './devoluciones.reducer';

interface TestSchema {
  devoluciones: State;
}

describe('DevolucionesFacade', () => {
  let facade: DevolucionesFacade;
  let store: Store<TestSchema>;
  const createDevolucionesEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as DevolucionesEntity);

  beforeEach(() => {});

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(DEVOLUCIONES_FEATURE_KEY, reducer),
          EffectsModule.forFeature([DevolucionesEffects]),
        ],
        providers: [DevolucionesFacade],
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [
          NxModule.forRoot(),
          StoreModule.forRoot({}),
          EffectsModule.forRoot([]),
          CustomFeatureModule,
        ],
      })
      class RootModule {}
      TestBed.configureTestingModule({ imports: [RootModule] });

      store = TestBed.get(Store);
      facade = TestBed.get(DevolucionesFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async (done) => {
      try {
        let list = await readFirst(facade.allDevoluciones$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        facade.dispatch(DevolucionesActions.loadDevoluciones());

        list = await readFirst(facade.allDevoluciones$);
        isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(true);

        done();
      } catch (err) {
        done.fail(err);
      }
    });

    /**
     * Use `loadDevolucionesSuccess` to manually update list
     */
    it('allDevoluciones$ should return the loaded list; and loaded flag == true', async (done) => {
      try {
        let list = await readFirst(facade.allDevoluciones$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        facade.dispatch(
          DevolucionesActions.loadDevolucionesSuccess({
            devoluciones: [
              createDevolucionesEntity('AAA'),
              createDevolucionesEntity('BBB'),
            ],
          })
        );

        list = await readFirst(facade.allDevoluciones$);
        isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(2);
        expect(isLoaded).toBe(true);

        done();
      } catch (err) {
        done.fail(err);
      }
    });
  });
});
