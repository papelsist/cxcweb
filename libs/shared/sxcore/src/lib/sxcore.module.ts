import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { throwIfAlreadyLoaded } from '@nx-papelsa/shared/utils/core-models';
import { UiCommonModule } from '@nx-papelsa/shared/utils/ui-common';

@NgModule({
  imports: [CommonModule, HttpClientModule, UiCommonModule.forRoot()],
  providers: [],
  exports: [CommonModule],
})
export class SxcoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: SxcoreModule
  ) {
    throwIfAlreadyLoaded(parentModule, 'SxcoreModule');
  }
}
