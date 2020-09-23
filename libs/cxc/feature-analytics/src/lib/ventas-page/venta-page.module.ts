import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UiMaterialModule } from '@nx-papelsa/shared/utils/ui-material';
import { UiCovalentModule } from '@nx-papelsa/shared/utils/ui-covalent';
import { UiCommonModule } from '@nx-papelsa/shared/utils/ui-common';
import { UiFormsModule } from '@nx-papelsa/shared/utils/ui-forms';

import { AgGridModule } from 'ag-grid-angular';
import { AgBooleanRendererComponent } from '@nx-papelsa/shared/utils/ui-common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';

import { CovalentSidesheetModule } from '@covalent/core/sidesheet';
import { CovalentBaseEchartsModule } from '@covalent/echarts/base';
import { CovalentPieEchartsModule } from '@covalent/echarts/pie';
import { CovalentTooltipEchartsModule } from '@covalent/echarts/tooltip';
import { CovalentBarEchartsModule } from '@covalent/echarts/bar';

import { VentasPageComponent } from './ventas-page.component';
import { VentaMensualComponent } from './mensual/venta-mensual.component';
import { VentaGridComponent } from './venta-grid/venta-grid.component';
import { CubeSelectorComponent } from './cube-selector/cube-selector.component';
import { VtaMensualBarChartComponent } from './mensual/vta-mensual-bar-chart.component';

const routes: Routes = [
  {
    path: '',
    component: VentasPageComponent,
    children: [{ path: 'mensual', component: VentaMensualComponent }],
  },
];

@NgModule({
  declarations: [
    VentasPageComponent,
    VentaMensualComponent,
    VentaGridComponent,
    CubeSelectorComponent,
    VtaMensualBarChartComponent,
  ],
  imports: [
    UiCommonModule,
    UiMaterialModule,
    UiCovalentModule,
    UiFormsModule,
    MatTabsModule,
    MatSidenavModule,
    CovalentBaseEchartsModule,
    CovalentPieEchartsModule,
    CovalentSidesheetModule,
    CovalentTooltipEchartsModule,
    CovalentBarEchartsModule,
    AgGridModule.withComponents([AgBooleanRendererComponent]),
    RouterModule.forChild(routes),
  ],
})
export class VentaPageModule {}
