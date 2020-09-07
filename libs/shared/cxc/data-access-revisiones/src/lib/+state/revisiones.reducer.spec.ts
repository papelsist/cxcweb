import { RevisionesEntity } from './revisiones.models';
import * as RevisionesActions from './revisiones.actions';
import { State, initialState, reducer } from './revisiones.reducer';

describe('Revisiones Reducer', () => {
  const createRevisionesEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as RevisionesEntity);

  beforeEach(() => {});

  describe('valid Revisiones actions', () => {
    it('loadRevisionesSuccess should return set the list of known Revisiones', () => {
      const revisiones = [
        createRevisionesEntity('PRODUCT-AAA'),
        createRevisionesEntity('PRODUCT-zzz'),
      ];
      const action = RevisionesActions.loadRevisionesSuccess({ revisiones });

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
