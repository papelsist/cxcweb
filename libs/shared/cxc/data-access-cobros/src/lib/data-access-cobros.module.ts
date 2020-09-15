import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromCobros from './+state/cobros.reducer';
import { CobrosEffects } from './+state/cobros.effects';
import { CobrosFacade } from './+state/cobros.facade';

import { MatDialogModule } from '@angular/material/dialog';
import { CovalentDialogsModule } from '@covalent/core/dialogs';

import { COBROS_GUARDS } from './guards';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(fromCobros.COBROS_FEATURE_KEY, fromCobros.reducer),
    EffectsModule.forFeature([CobrosEffects]),
    MatDialogModule,
    CovalentDialogsModule,
  ],
  providers: [CobrosFacade, ...COBROS_GUARDS],
})
export class DataAccessCobrosModule {}
