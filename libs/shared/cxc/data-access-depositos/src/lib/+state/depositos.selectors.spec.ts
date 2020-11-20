import { Deposito } from './depositos.models';
import { State, depositosAdapter, initialState } from './depositos.reducer';
import * as DepositosSelectors from './depositos.selectors';

describe('Depositos Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getDepositosId = (it) => it['id'];
  const createDeposito = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as any);

  let state;

  beforeEach(() => {
    state = {
      depositos: depositosAdapter.setAll(
        [
          createDeposito('PRODUCT-AAA'),
          createDeposito('PRODUCT-BBB'),
          createDeposito('PRODUCT-CCC'),
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

  describe('Depositos Selectors', () => {
    it('getAllDepositos() should return the list of Depositos', () => {
      const results = DepositosSelectors.getAllDepositos(state);
      const selId = getDepositosId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = DepositosSelectors.getSelected(state);
      const selId = getDepositosId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getDepositosLoaded() should return the current 'loaded' status", () => {
      const result = DepositosSelectors.getDepositosLoaded(state);

      expect(result).toBe(true);
    });

    it("getDepositosError() should return the current 'error' state", () => {
      const result = DepositosSelectors.getDepositosError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
