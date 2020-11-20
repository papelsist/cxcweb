import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'nx-papelsa-depositos-autorizados',
  template: ` <h1>Depositos autorizados PAGE</h1> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutorizadosPageComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
