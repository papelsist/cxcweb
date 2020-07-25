import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

import { FormGroup } from '@angular/forms';

@Component({
  selector: 'nx-papelsa-cxc-base-calculo',
  template: `
    <mat-form-field
      [formGroup]="parent"
      [appearance]="apparence"
      [style.width.px]="140"
    >
      <mat-label>Base de cálculo</mat-label>
      <mat-select placeholder="Base" [formControlName]="property">
        <mat-option *ngFor="let f of tipos" [value]="f">
          {{ f }}
        </mat-option>
      </mat-select>
      <!-- <mat-error>Seleccione la base para el cálculo</mat-error> -->
    </mat-form-field>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseDeCalculoFieldComponent implements OnInit {
  @Input() tipos = ['SALDO', 'TOTAL'];

  @Input() parent: FormGroup;
  @Input() property = 'baseDelCalculo';
  @Input() apparence: 'legacy' | 'standard' | 'fill' | 'outline' = 'standard';

  constructor() {}

  ngOnInit() {}
}
