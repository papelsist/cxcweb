import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';

import { COMPONENTS } from './components';

const MATERIAL = [
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MatTableModule,
  MatDividerModule,
  MatToolbarModule,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, ...MATERIAL],
  exports: [...MATERIAL, ...COMPONENTS],
})
export class UiMaterialModule {}
