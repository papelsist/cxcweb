import { BaseGridComponent } from './base-grid/base-grid.component';
import { PeriodoDialogComponent } from './periodo-dialog/periodo-dialog.component';
import { PeriodoPickerComponent } from './periodo-picker/periodo-picker.component';
import { AgBooleanRendererComponent } from './ag-boolean-renderer/ag-boolean-renderer.component';
import { AgPrinterRendererComponent } from './ag-printer-renderer/ag-printer-renderer.component';
import { BaseComponent } from './base-component/base.component';
import { FechaDialogComponent } from './fecha-dialog/fecha-dialog.component';
import { TelefonoDialogComponent } from './telefono-dialog/telefono-dialog.component';
export const UI_COMMONS_COMPONENTS = [
  // BaseComponent,
  BaseGridComponent,
  PeriodoDialogComponent,
  PeriodoPickerComponent,
  FechaDialogComponent,
  AgBooleanRendererComponent,
  AgPrinterRendererComponent,
  TelefonoDialogComponent,
];
export const UI_COMMONS_ENTRY_COMPONENTS = [
  PeriodoDialogComponent,
  AgBooleanRendererComponent,
];

export * from './base-component/base.component';
export * from './base-grid/base-grid.component';
export * from './periodo-dialog/periodo-dialog.component';
export * from './periodo-picker/periodo-picker.component';
export * from './fecha-dialog/fecha-dialog.component';
export * from './ag-boolean-renderer/ag-boolean-renderer.component';
export * from './ag-printer-renderer/ag-printer-renderer.component';
export * from './telefono-dialog/telefono-dialog.component';
