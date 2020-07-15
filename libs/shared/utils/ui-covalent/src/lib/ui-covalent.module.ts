import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CovalentCommonModule } from '@covalent/core/common';
import { CovalentDialogsModule } from '@covalent/core/dialogs';
import { CovalentLoadingModule } from '@covalent/core/loading';
import { CovalentSearchModule } from '@covalent/core/search';

const COVALENT_MODULES = [
  CovalentCommonModule,
  CovalentDialogsModule,
  CovalentLoadingModule,
  CovalentSearchModule,
];

@NgModule({
  imports: [CommonModule, ...COVALENT_MODULES],
  exports: [...COVALENT_MODULES],
})
export class UiCovalentModule {}
