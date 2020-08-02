import { FacturasEntity } from './facturas.models';
import { State, facturasAdapter, initialState } from './facturas.reducer';
import * as FacturasSelectors from './facturas.selectors';

describe('Facturas Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getFacturasId = (it) => it['id'];
  const createFacturasEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as FacturasEntity);

  let state;

  beforeEach(() => {
    state = {
      facturas: facturasAdapter.addAll(
        [
          createFacturasEntity('PRODUCT-AAA'),
          createFacturasEntity('PRODUCT-BBB'),
          createFacturasEntity('PRODUCT-CCC'),
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

  describe('Facturas Selectors', () => {
    it('getAllFacturas() should return the list of Facturas', () => {
      const results = FacturasSelectors.getAllFacturas(state);
      const selId = getFacturasId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = FacturasSelectors.getSelected(state);
      const selId = getFacturasId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getFacturasLoaded() should return the current 'loaded' status", () => {
      const result = FacturasSelectors.getFacturasLoaded(state);

      expect(result).toBe(true);
    });

    it("getFacturasError() should return the current 'error' state", () => {
      const result = FacturasSelectors.getFacturasError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
