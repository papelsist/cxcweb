import { CobrosEntity } from './cobros.models';
import { State, cobrosAdapter, initialState } from './cobros.reducer';
import * as CobrosSelectors from './cobros.selectors';

describe('Cobros Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getCobrosId = (it) => it['id'];
  const createCobrosEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as CobrosEntity);

  let state;

  beforeEach(() => {
    state = {
      cobros: cobrosAdapter.addAll(
        [
          createCobrosEntity('PRODUCT-AAA'),
          createCobrosEntity('PRODUCT-BBB'),
          createCobrosEntity('PRODUCT-CCC'),
        ],
        {
          ...initialState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        }
      ),
    };
  });

  describe('Cobros Selectors', () => {
    it('getAllCobros() should return the list of Cobros', () => {
      const results = CobrosSelectors.getAllCobros(state);
      const selId = getCobrosId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = CobrosSelectors.getSelected(state);
      const selId = getCobrosId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getCobrosLoaded() should return the current 'loaded' status", () => {
      const result = CobrosSelectors.getCobrosLoaded(state);

      expect(result).toBe(true);
    });

    it("getCobrosError() should return the current 'error' state", () => {
      const result = CobrosSelectors.getCobrosError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
