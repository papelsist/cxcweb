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
  constructor(private auth: AuthFacade, private router: Router) {}

  ngOnInit(): void {
    this.auth.displayName$.subscribe((name) => console.log('User: ', name));
  }

  logout() {
    this.auth.logout();
  }

  lookupCliente() {
    this.router.navigate(['/clientes']);
  }

  /******* START HotKeys Definitions  *************/

  @HostListener('document:keydown.control.shift.c', ['$event'])
  onHotKeyClientes(event: KeyboardEvent) {
    this.lookupCliente();
  }

  @HostListener('document:keydown.alt.shift.u', ['$event'])
  altShift_C(event: KeyboardEvent) {
    this.lookupCliente();
  }

  @HostListener('document:keydown.meta.shift.c', ['$event'])
  onHotKeyClienteMata(event: KeyboardEvent) {
    this.lookupCliente();
  }
}
