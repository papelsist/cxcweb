import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromRevisiones from './+state/revisiones.reducer';
import { RevisionesEffects } from './+state/revisiones.effects';
import { RevisionesFacade } from './+state/revisiones.facade';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      fromRevisiones.REVISIONES_FEATURE_KEY,
      fromRevisiones.reducer
    ),
    EffectsModule.forFeature([RevisionesEffects]),
  ],
  providers: [RevisionesFacade],
})
export class DataAccessRevisionesModule {}
