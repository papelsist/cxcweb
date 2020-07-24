import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromBonificaciones from './+state/bonificaciones.reducer';
import { BonificacionesEffects } from './+state/bonificaciones.effects';
import { BonificacionesFacade } from './+state/bonificaciones.facade';
import { BONIFICACIONES_GUARDS } from './guards';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      fromBonificaciones.BONIFICACIONES_FEATURE_KEY,
      fromBonificaciones.reducer
    ),
    EffectsModule.forFeature([BonificacionesEffects]),
  ],
  providers: [BonificacionesFacade, ...BONIFICACIONES_GUARDS],
})
export class DataAccessBonificacionesModule {}
