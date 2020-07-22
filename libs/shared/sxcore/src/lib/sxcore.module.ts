import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { throwIfAlreadyLoaded } from '@nx-papelsa/shared/utils/core-models';
import { UiCommonModule } from '@nx-papelsa/shared/utils/ui-common';

@NgModule({
  imports: [CommonModule, UiCommonModule.forRoot()],
  providers: [],
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
