import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromFacturas from './+state/facturas.reducer';
import { FacturasEffects } from './+state/facturas.effects';
import { FacturasFacade } from './+state/facturas.facade';

import { FACTURAS_GUARDS } from './guards';

import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  imports: [
    CommonModule,
    MatSnackBarModule,
    StoreModule.forFeature(
      fromFacturas.FACTURAS_FEATURE_KEY,
      fromFacturas.reducer
    ),
    EffectsModule.forFeature([FacturasEffects]),
  ],
  providers: [FacturasFacade, ...FACTURAS_GUARDS],
})
export class DataAccessFacturasModule {}
