import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CovalentDialogsModule } from '@covalent/core/dialogs';

const COVALENT_MODULES = [CovalentDialogsModule];

@NgModule({
  imports: [CommonModule, ...COVALENT_MODULES],
  exports: [...COVALENT_MODULES],
})
export class UiCovalentModule {}
