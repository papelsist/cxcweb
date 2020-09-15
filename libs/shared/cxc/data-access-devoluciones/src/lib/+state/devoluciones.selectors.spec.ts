import { DevolucionesEntity } from './devoluciones.models';
import {
  State,
  devolucionesAdapter,
  initialState,
} from './devoluciones.reducer';
import * as DevolucionesSelectors from './devoluciones.selectors';

describe('Devoluciones Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getDevolucionesId = (it) => it['id'];
  const createDevolucionesEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as DevolucionesEntity);

  let state;

  beforeEach(() => {
    state = {
      devoluciones: devolucionesAdapter.addAll(
        [
          createDevolucionesEntity('PRODUCT-AAA'),
          createDevolucionesEntity('PRODUCT-BBB'),
          createDevolucionesEntity('PRODUCT-CCC'),
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

  describe('Devoluciones Selectors', () => {
    it('getAllDevoluciones() should return the list of Devoluciones', () => {
      const results = DevolucionesSelectors.getAllDevoluciones(state);
      const selId = getDevolucionesId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = DevolucionesSelectors.getSelected(state);
      const selId = getDevolucionesId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getDevolucionesLoaded() should return the current 'loaded' status", () => {
      const result = DevolucionesSelectors.getDevolucionesLoaded(state);

      expect(result).toBe(true);
    });

    it("getDevolucionesError() should return the current 'error' state", () => {
      const result = DevolucionesSelectors.getDevolucionesError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
