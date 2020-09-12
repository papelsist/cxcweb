import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { ClientesUiService } from './clientes-ui.service';

@Injectable()
export class ClientesGuard implements CanActivate {
  constructor(private ui: ClientesUiService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.ui.lookupCliente();
    return false;
  }
}
