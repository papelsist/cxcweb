import { createAction, props } from '@ngrx/store';
import { Cartera } from '@nx-papelsa/shared/utils/core-models';

export const setCartera = createAction(
  '[CarteraGuard] Set cartera',
  props<{ cartera: Cartera }>()
);
