import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import * as fromCXC from './+state/cxc.reducer';
import { CXCFacade } from './+state/cxc.facade';

import { throwIfAlreadyLoaded } from '@nx-papelsa/shared/utils/core-models';
import { CXCCarteraGuard } from './router';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(fromCXC.CXC_FEATURE_KEY, fromCXC.reducer),
    EffectsModule.forFeature([]),
  ],
  providers: [CXCFacade, CXCCarteraGuard],
})
export class DataAccesModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: DataAccesModule
  ) {
    throwIfAlreadyLoaded(parentModule, 'DataAccesModule');
  }
}
