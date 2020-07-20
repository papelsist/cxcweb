import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';
import { UI_COMMONS_COMPONENTS } from './components';

const COMMON_MODULES = [
  CommonModule,
  RouterModule,
  ReactiveFormsModule,
  FlexLayoutModule,
  FormsModule,
];

@NgModule({
  declarations: [...UI_COMMONS_COMPONENTS],
  imports: [...COMMON_MODULES],
  exports: [...COMMON_MODULES, ...UI_COMMONS_COMPONENTS],
})
export class UiCommonModule {}
