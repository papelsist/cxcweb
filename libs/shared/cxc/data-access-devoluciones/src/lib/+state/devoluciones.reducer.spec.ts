import { DevolucionesEntity } from './devoluciones.models';
import * as DevolucionesActions from './devoluciones.actions';
import { State, initialState, reducer } from './devoluciones.reducer';

describe('Devoluciones Reducer', () => {
  const createDevolucionesEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as DevolucionesEntity);

  beforeEach(() => {});

  describe('valid Devoluciones actions', () => {
    it('loadDevolucionesSuccess should return set the list of known Devoluciones', () => {
      const devoluciones = [
        createDevolucionesEntity('PRODUCT-AAA'),
        createDevolucionesEntity('PRODUCT-zzz'),
      ];
      const action = DevolucionesActions.loadDevolucionesSuccess({
        devoluciones,
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
