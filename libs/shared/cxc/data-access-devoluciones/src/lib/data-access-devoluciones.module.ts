import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromDevoluciones from './+state/devoluciones.reducer';
import { DevolucionesEffects } from './+state/devoluciones.effects';
import { DevolucionesFacade } from './+state/devoluciones.facade';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      fromDevoluciones.DEVOLUCIONES_FEATURE_KEY,
      fromDevoluciones.reducer
    ),
    EffectsModule.forFeature([DevolucionesEffects]),
  ],
  providers: [DevolucionesFacade],
})
export class DataAccessDevolucionesModule {}
