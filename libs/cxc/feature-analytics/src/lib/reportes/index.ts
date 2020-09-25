import { AntiguedadCteDialogComponent } from './antiguedad-cte-dialog.component';
import { AntiguedadDialogComponent } from './antiguedad-dialog.component';
import { BajaEnVentaDialogComponent } from './baja-en-ventas.dialog.component';
import { CarteraCodDialogComponent } from './cartera-cod-dialog.component';
import { ComparativoMejoresClientesComponent } from './comparativo-mejores-clientes.component';
import { SucursalPeriodoDialogComponent } from './sucursal-periodo-dialog.component';
import { FacturasConDevDialogComponent } from './facturas-con-dev-dialog.component';
import { MejoresClientesComponent } from './mejores-clientes.component';
import { VentasPorClienteComponent } from './ventas-por-cliente.component';
import { VentasPorLineaClienteComponent } from './ventas-por-linea-cliente.component';

export const REPORTES = [
  BajaEnVentaDialogComponent,
  MejoresClientesComponent,
  VentasPorClienteComponent,
  ComparativoMejoresClientesComponent,
  VentasPorLineaClienteComponent,
  // Otros
  AntiguedadDialogComponent,
  AntiguedadCteDialogComponent,
  CarteraCodDialogComponent,
  FacturasConDevDialogComponent,
  SucursalPeriodoDialogComponent,
];

export * from './baja-en-ventas.dialog.component';
export * from './mejores-clientes.component';
