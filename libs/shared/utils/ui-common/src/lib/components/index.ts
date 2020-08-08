import { BaseGridComponent } from './base-grid/base-grid.component';
import { PeriodoDialogComponent } from './periodo-dialog/periodo-dialog.component';
import { PeriodoPickerComponent } from './periodo-picker/periodo-picker.component';
import { AgBooleanRendererComponent } from './ag-boolean-renderer/ag-boolean-renderer.component';
import { AgPrinterRendererComponent } from './ag-printer-renderer/ag-printer-renderer.component';
export const UI_COMMONS_COMPONENTS = [
  BaseGridComponent,
  PeriodoDialogComponent,
  PeriodoPickerComponent,
  AgBooleanRendererComponent,
  AgPrinterRendererComponent,
];
export const UI_COMMONS_ENTRY_COMPONENTS = [
  PeriodoDialogComponent,
  AgBooleanRendererComponent,
];

export * from './base-grid/base-grid.component';
export * from './periodo-dialog/periodo-dialog.component';
export * from './periodo-picker/periodo-picker.component';
export * from './ag-boolean-renderer/ag-boolean-renderer.component';
export * from './ag-printer-renderer/ag-printer-renderer.component';
