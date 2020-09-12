import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromClientes from './+state/clientes.reducer';
import { ClientesEffects } from './+state/clientes.effects';
import { ClientesFacade } from './+state/clientes.facade';
import { ClienteExistsGuard } from './services/cliente-exists.guard';

import { CovalentDialogsModule } from '@covalent/core/dialogs';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      fromClientes.CLIENTES_FEATURE_KEY,
      fromClientes.reducer
    ),
    EffectsModule.forFeature([ClientesEffects]),
    CovalentDialogsModule,
  ],
  providers: [ClientesFacade, ClienteExistsGuard],
})
export class DataAccessClientesModule {}
