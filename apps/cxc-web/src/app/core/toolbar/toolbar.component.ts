import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import { AuthFacade } from '@nx-papelsa/auth';

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
  constructor(private auth: AuthFacade) {}

  ngOnInit(): void {
    this.auth.displayName$.subscribe((name) => console.log('User: ', name));
  }

  logout() {
    this.auth.logout();
  }
}
