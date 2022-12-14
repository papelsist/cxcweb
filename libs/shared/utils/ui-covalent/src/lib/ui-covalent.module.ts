import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CovalentCommonModule } from '@covalent/core/common';
import { CovalentDialogsModule } from '@covalent/core/dialogs';
import { CovalentLoadingModule } from '@covalent/core/loading';
import { CovalentSearchModule } from '@covalent/core/search';
import { CovalentMessageModule } from '@covalent/core/message';

const COVALENT_MODULES = [
  CovalentCommonModule,
  CovalentDialogsModule,
  CovalentLoadingModule,
  CovalentSearchModule,
  CovalentMessageModule,
];

@NgModule({
  imports: [CommonModule, ...COVALENT_MODULES],
  exports: [...COVALENT_MODULES],
})
export class UiCovalentModule {}
