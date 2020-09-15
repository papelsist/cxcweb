import { FacturasEntity } from './facturas.models';
import * as FacturasActions from './facturas.actions';
import { State, initialState, reducer } from './facturas.reducer';

describe('Facturas Reducer', () => {
  const createFacturasEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as FacturasEntity);

  beforeEach(() => {});

  describe('valid Facturas actions', () => {
    it('loadFacturasSuccess should return set the list of known Facturas', () => {
      const facturas = [
        createFacturasEntity('PRODUCT-AAA'),
        createFacturasEntity('PRODUCT-zzz'),
      ];
      const action = FacturasActions.loadFacturasSuccess({ facturas });

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
