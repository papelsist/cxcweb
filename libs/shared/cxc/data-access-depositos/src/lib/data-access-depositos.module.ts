import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromDepositos from './+state/depositos.reducer';
import { DepositosEffects } from './+state/depositos.effects';
import { DepositosFacade } from './+state/depositos.facade';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      fromDepositos.DEPOSITOS_FEATURE_KEY,
      fromDepositos.reducer
    ),
    EffectsModule.forFeature([DepositosEffects]),
  ],
  providers: [DepositosFacade],
})
export class DataAccessDepositosModule {}
