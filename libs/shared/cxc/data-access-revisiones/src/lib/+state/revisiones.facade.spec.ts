import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { readFirst } from '@nrwl/angular/testing';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';

import { NxModule } from '@nrwl/angular';

import { RevisionesEntity } from './revisiones.models';
import { RevisionesEffects } from './revisiones.effects';
import { RevisionesFacade } from './revisiones.facade';

import * as RevisionesSelectors from './revisiones.selectors';
import * as RevisionesActions from './revisiones.actions';
import {
  REVISIONES_FEATURE_KEY,
  State,
  initialState,
  reducer,
} from './revisiones.reducer';

interface TestSchema {
  revisiones: State;
}

describe('RevisionesFacade', () => {
  let facade: RevisionesFacade;
  let store: Store<TestSchema>;
  const createRevisionesEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as RevisionesEntity);

  beforeEach(() => {});

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(REVISIONES_FEATURE_KEY, reducer),
          EffectsModule.forFeature([RevisionesEffects]),
        ],
        providers: [RevisionesFacade],
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
      facade = TestBed.get(RevisionesFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async (done) => {
      try {
        let list = await readFirst(facade.allRevisiones$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        facade.dispatch(RevisionesActions.loadRevisiones());

        list = await readFirst(facade.allRevisiones$);
        isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(true);

        done();
      } catch (err) {
        done.fail(err);
      }
    });

    /**
     * Use `loadRevisionesSuccess` to manually update list
     */
    it('allRevisiones$ should return the loaded list; and loaded flag == true', async (done) => {
      try {
        let list = await readFirst(facade.allRevisiones$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        facade.dispatch(
          RevisionesActions.loadRevisionesSuccess({
            revisiones: [
              createRevisionesEntity('AAA'),
              createRevisionesEntity('BBB'),
            ],
          })
        );

        list = await readFirst(facade.allRevisiones$);
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
