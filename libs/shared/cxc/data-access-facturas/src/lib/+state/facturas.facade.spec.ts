import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { readFirst } from '@nrwl/angular/testing';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';

import { NxModule } from '@nrwl/angular';

import { FacturasEntity } from './facturas.models';
import { FacturasEffects } from './facturas.effects';
import { FacturasFacade } from './facturas.facade';

import * as FacturasSelectors from './facturas.selectors';
import * as FacturasActions from './facturas.actions';
import {
  FACTURAS_FEATURE_KEY,
  State,
  initialState,
  reducer,
} from './facturas.reducer';

interface TestSchema {
  facturas: State;
}

describe('FacturasFacade', () => {
  let facade: FacturasFacade;
  let store: Store<TestSchema>;
  const createFacturasEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as FacturasEntity);

  beforeEach(() => {});

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(FACTURAS_FEATURE_KEY, reducer),
          EffectsModule.forFeature([FacturasEffects]),
        ],
        providers: [FacturasFacade],
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
      facade = TestBed.get(FacturasFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async (done) => {
      try {
        let list = await readFirst(facade.allFacturas$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        facade.dispatch(FacturasActions.loadFacturas());

        list = await readFirst(facade.allFacturas$);
        isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(true);

        done();
      } catch (err) {
        done.fail(err);
      }
    });

    /**
     * Use `loadFacturasSuccess` to manually update list
     */
    it('allFacturas$ should return the loaded list; and loaded flag == true', async (done) => {
      try {
        let list = await readFirst(facade.allFacturas$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        facade.dispatch(
          FacturasActions.loadFacturasSuccess({
            facturas: [
              createFacturasEntity('AAA'),
              createFacturasEntity('BBB'),
            ],
          })
        );

        list = await readFirst(facade.allFacturas$);
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
