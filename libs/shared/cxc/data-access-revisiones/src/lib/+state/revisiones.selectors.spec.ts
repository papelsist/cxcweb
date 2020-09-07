import { RevisionesEntity } from './revisiones.models';
import { State, revisionesAdapter, initialState } from './revisiones.reducer';
import * as RevisionesSelectors from './revisiones.selectors';

describe('Revisiones Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getRevisionesId = (it) => it['id'];
  const createRevisionesEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as RevisionesEntity);

  let state;

  beforeEach(() => {
    state = {
      revisiones: revisionesAdapter.addAll(
        [
          createRevisionesEntity('PRODUCT-AAA'),
          createRevisionesEntity('PRODUCT-BBB'),
          createRevisionesEntity('PRODUCT-CCC'),
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

  describe('Revisiones Selectors', () => {
    it('getAllRevisiones() should return the list of Revisiones', () => {
      const results = RevisionesSelectors.getAllRevisiones(state);
      const selId = getRevisionesId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = RevisionesSelectors.getSelected(state);
      const selId = getRevisionesId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getRevisionesLoaded() should return the current 'loaded' status", () => {
      const result = RevisionesSelectors.getRevisionesLoaded(state);

      expect(result).toBe(true);
    });

    it("getRevisionesError() should return the current 'error' state", () => {
      const result = RevisionesSelectors.getRevisionesError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
