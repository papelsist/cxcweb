import { CfdiEnvioDialogComponent } from './envio-dialog/cfdi-envio-dialog.component';
import { CfdiCancelarDialogComponent } from './cancel-dialog/cfdi-cancelar-dialog.component';
import { EnvioBulkDialogComponent } from './envio-bulk-dialog/envio-bulk-dialog.component';

export const CFDI_COMPONENTS = [
  CfdiEnvioDialogComponent,
  CfdiCancelarDialogComponent,
  EnvioBulkDialogComponent,
];

export const CFDI_ENTRY_COMPONENTS = [
  CfdiEnvioDialogComponent,
  CfdiCancelarDialogComponent,
];

export * from './envio-dialog/cfdi-envio-dialog.component';
export * from './cancel-dialog/cfdi-cancelar-dialog.component';
export * from './envio-bulk-dialog/envio-bulk-dialog.component';
