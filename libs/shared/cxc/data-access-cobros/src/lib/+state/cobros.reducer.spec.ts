import * as CobrosActions from './cobros.actions';
import { State, initialState, reducer } from './cobros.reducer';
import { Cobro } from '@nx-papelsa/shared/utils/core-models';

describe('Cobros Reducer', () => {
  const createCobrosEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as Cobro);

  beforeEach(() => {});

  describe('valid Cobros actions', () => {
    it('loadCobrosSuccess should return set the list of known Cobros', () => {
      const cobros = [
        createCobrosEntity('PRODUCT-AAA'),
        createCobrosEntity('PRODUCT-zzz'),
      ];
      const action = CobrosActions.loadCobrosSuccess({ cobros });

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
