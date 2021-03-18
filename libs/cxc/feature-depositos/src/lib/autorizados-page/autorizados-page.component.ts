import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'nx-papelsa-depositos-autorizados',
  template: ` <mat-card> </mat-card> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutorizadosPageComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
