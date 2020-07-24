import { BonificacionesEntity } from './bonificaciones.models';
import * as BonificacionesActions from './bonificaciones.actions';
import { State, initialState, reducer } from './bonificaciones.reducer';

describe('Bonificaciones Reducer', () => {
  const createBonificacionesEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as BonificacionesEntity);

  beforeEach(() => {});

  describe('valid Bonificaciones actions', () => {
    it('loadBonificacionesSuccess should return set the list of known Bonificaciones', () => {
      const bonificaciones = [
        createBonificacionesEntity('PRODUCT-AAA'),
        createBonificacionesEntity('PRODUCT-zzz'),
      ];
      const action = BonificacionesActions.loadBonificacionesSuccess({
        bonificaciones,
      });

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
