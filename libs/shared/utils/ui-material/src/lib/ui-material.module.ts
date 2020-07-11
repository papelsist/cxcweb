import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

const MATERIAL = [
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MatTableModule,
];

@NgModule({
  imports: [CommonModule, ...MATERIAL],
  exports: [...MATERIAL],
})
export class UiMaterialModule {}
