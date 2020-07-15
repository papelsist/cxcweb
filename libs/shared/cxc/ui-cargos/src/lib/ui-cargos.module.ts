import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CreateCargoComponent } from './create-cargo/create-cargo.component';

import { UiMaterialModule } from '@nx-papelsa/shared/utils/ui-material';
import { CreateCargoService } from './create-cargo/create-cargo.service';

@NgModule({
  declarations: [CreateCargoComponent],
  entryComponents: [CreateCargoComponent],
  imports: [CommonModule, ReactiveFormsModule, UiMaterialModule],
  exports: [CreateCargoComponent],
  providers: [CreateCargoService],
})
export class UiCargosModule {}
