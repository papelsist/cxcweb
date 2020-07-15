import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';

import { COMPONENTS } from './components';

const MATERIAL = [
  MatButtonModule,
  MatIconModule,
  MatCheckboxModule,
  MatCardModule,
  MatMenuModule,
  MatDividerModule,
  MatDialogModule,
  MatTableModule,
  MatToolbarModule,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, ...MATERIAL],
  exports: [...MATERIAL, ...COMPONENTS],
})
export class UiMaterialModule {}
