import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';

import { AuthFacade } from '@nx-papelsa/auth';
import { Router } from '@angular/router';
import { SelectorCxcService } from '@nx-papelsa/shared/cxc/ui-cxc-common';

@Component({
  selector: 'nx-papelsa-cxc-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent implements OnInit {
  @Output() toogleSideNav = new EventEmitter();
  // user$ = this.auth.
  isLoggedIn$ = this.auth.isLoggedIn$;
  displayName$ = this.auth.displayName$;
  roles = [];
  constructor(
    private auth: AuthFacade,
    private router: Router,
    private selectorService: SelectorCxcService
  ) {}

  ngOnInit(): void {
    this.auth.displayName$.subscribe((name) => console.log('User: ', name));
  }

  logout() {
    this.auth.logout();
  }

  lookupCliente() {
    this.router.navigate(['/clientes']);
  }

  lookupFactura() {
    this.selectorService.findCuentaPorCobrar();
  }

  async hasRole(role: string) {
    const roles = await this.auth.roles$.toPromise();
    return roles.find((item) => item === role);
  }

  /******* START HotKeys Definitions  *************/

  /*
  @HostListener('document:keydown.control.shift.c', ['$event'])
  onHotKeyClientes(event: KeyboardEvent) {
    this.lookupCliente();
  }

  @HostListener('document:keydown.alt.shift.u', ['$event'])
  altShift_C(event: KeyboardEvent) {
    this.lookupCliente();
  }
  */

  @HostListener('document:keydown.control.F2', ['$event'])
  onHotKeyClienteMata(event: KeyboardEvent) {
    this.lookupCliente();
  }

  @HostListener('document:keydown.control.shift.f', ['$event'])
  onHotKeyFindFactura(event: KeyboardEvent) {
    this.lookupFactura();
  }
}
