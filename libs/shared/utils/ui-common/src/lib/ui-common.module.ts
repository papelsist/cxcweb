import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';

const COMMON_MODULES = [
  CommonModule,
  RouterModule,
  ReactiveFormsModule,
  FlexLayoutModule,
];

@NgModule({
  imports: [...COMMON_MODULES],
  exports: [...COMMON_MODULES],
})
export class UiCommonModule {}
