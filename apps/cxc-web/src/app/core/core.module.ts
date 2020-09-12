import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MainPageComponent } from './main-page/main-page.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';

import { ToolbarComponent } from './toolbar/toolbar.component';
import { FlexLayoutModule } from '@angular/flex-layout';

// Refactor - Valid from here
import { SxcoreModule } from '@nx-papelsa/shared/sxcore';
import { DataAccesModule } from '@nx-papelsa/shared/cxc/data-acces';
import { AuthModule } from '@nx-papelsa/auth';
import { DataAccessClientesModule } from '@nx-papelsa/shared/clientes/data-access-clientes';
// import { ClientesFeatureModule } from '@nx-papelsa/clientes/clientes-feature';

@NgModule({
  declarations: [MainPageComponent, ToolbarComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    FlexLayoutModule,
    SxcoreModule,
    DataAccesModule,
    DataAccessClientesModule,
    // ClientesFeatureModule.forRoot(),
    AuthModule,
  ],
  exports: [
    MainPageComponent,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
  ],
})
export class CoreModule {}
