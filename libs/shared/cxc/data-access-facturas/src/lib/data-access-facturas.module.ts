import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromFacturas from './+state/facturas.reducer';
import { FacturasEffects } from './+state/facturas.effects';
import { FacturasFacade } from './+state/facturas.facade';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      fromFacturas.FACTURAS_FEATURE_KEY,
      fromFacturas.reducer
    ),
    EffectsModule.forFeature([FacturasEffects]),
  ],
  providers: [FacturasFacade],
})
export class DataAccessFacturasModule {}
