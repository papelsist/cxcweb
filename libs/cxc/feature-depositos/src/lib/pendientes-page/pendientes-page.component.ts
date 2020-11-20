import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Deposito } from '@nx-papelsa/shared/cxc/data-access-depositos';

import { Observable } from 'rxjs';

@Component({
  selector: 'nx-papelsa-depositos-pendientes',
  templateUrl: './pendientes-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendientesPageComponent implements OnInit {
  loading$: Observable<boolean>;
  constructor() {}

  ngOnInit() {}

  onCreate(deposito: Deposito) {
    console.log('Salvando deposito: ', deposito);
  }

  reload() {}
}
