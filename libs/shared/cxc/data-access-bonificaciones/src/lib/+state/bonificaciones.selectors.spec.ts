import { BonificacionesEntity } from './bonificaciones.models';
import {
  State,
  bonificacionesAdapter,
  initialState,
} from './bonificaciones.reducer';
import * as BonificacionesSelectors from './bonificaciones.selectors';

describe('Bonificaciones Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getBonificacionesId = (it) => it['id'];
  const createBonificacionesEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as BonificacionesEntity);

  let state;

  beforeEach(() => {
    state = {
      bonificaciones: bonificacionesAdapter.addAll(
        [
          createBonificacionesEntity('PRODUCT-AAA'),
          createBonificacionesEntity('PRODUCT-BBB'),
          createBonificacionesEntity('PRODUCT-CCC'),
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

  describe('Bonificaciones Selectors', () => {
    it('getAllBonificaciones() should return the list of Bonificaciones', () => {
      const results = BonificacionesSelectors.getAllBonificaciones(state);
      const selId = getBonificacionesId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = BonificacionesSelectors.getSelected(state);
      const selId = getBonificacionesId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getBonificacionesLoaded() should return the current 'loaded' status", () => {
      const result = BonificacionesSelectors.getBonificacionesLoaded(state);

      expect(result).toBe(true);
    });

    it("getBonificacionesError() should return the current 'error' state", () => {
      const result = BonificacionesSelectors.getBonificacionesError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
