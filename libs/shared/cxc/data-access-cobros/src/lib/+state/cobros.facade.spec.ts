import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { readFirst } from '@nrwl/angular/testing';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';

import { NxModule } from '@nrwl/angular';

import { CobrosEffects } from './cobros.effects';
import { CobrosFacade } from './cobros.facade';

import * as CobrosSelectors from './cobros.selectors';
import * as CobrosActions from './cobros.actions';
import {
  COBROS_FEATURE_KEY,
  State,
  initialState,
  reducer,
} from './cobros.reducer';
import { Cobro } from '@nx-papelsa/shared/utils/core-models';

interface TestSchema {
  cobros: State;
}

describe('CobrosFacade', () => {
  let facade: CobrosFacade;
  let store: Store<TestSchema>;
  const createCobrosEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as Cobro);

  beforeEach(() => {});

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(COBROS_FEATURE_KEY, reducer),
          EffectsModule.forFeature([CobrosEffects]),
        ],
        providers: [CobrosFacade],
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

      store = TestBed.inject(Store);
      facade = TestBed.inject(CobrosFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async (done) => {
      try {
        let list = await readFirst(facade.allCobros$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        facade.dispatch(CobrosActions.loadCobros());

        list = await readFirst(facade.allCobros$);
        isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(true);

        done();
      } catch (err) {
        done.fail(err);
      }
    });

    /**
     * Use `loadCobrosSuccess` to manually update list
     */
    it('allCobros$ should return the loaded list; and loaded flag == true', async (done) => {
      try {
        let list = await readFirst(facade.allCobros$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        facade.dispatch(
          CobrosActions.loadCobrosSuccess({
            cobros: [createCobrosEntity('AAA'), createCobrosEntity('BBB')],
          })
        );

        list = await readFirst(facade.allCobros$);
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
