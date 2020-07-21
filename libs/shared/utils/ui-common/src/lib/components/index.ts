import { BaseGridComponent } from './base-grid/base-grid.component';
import { PeriodoDialogComponent } from './periodo-dialog/periodo-dialog.component';
import { PeriodoPickerComponent } from './periodo-picker/periodo-picker.component';

export const UI_COMMONS_COMPONENTS = [
  BaseGridComponent,
  PeriodoDialogComponent,
  PeriodoPickerComponent,
];
export const UI_COMMONS_ENTRY_COMPONENTS = [PeriodoDialogComponent];

export * from './base-grid/base-grid.component';
export * from './periodo-dialog/periodo-dialog.component';
export * from './periodo-picker/periodo-picker.component';
