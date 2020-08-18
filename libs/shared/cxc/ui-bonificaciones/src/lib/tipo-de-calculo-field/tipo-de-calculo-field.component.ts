import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

import { FormGroup } from '@angular/forms';

@Component({
  selector: 'nx-papelsa-cxc-tipo-calculo',
  template: `
    <mat-form-field
      [formGroup]="parent"
      [appearance]="apparence"
      [style.width.%]="100"
    >
      <mat-label>Tipo de cálculo</mat-label>
      <mat-select placeholder="Tipo" [formControlName]="property">
        <mat-option *ngFor="let f of tipos" [value]="f">
          {{ f }}
        </mat-option>
      </mat-select>
      <mat-error>Seleccione el tipo de cálculo</mat-error>
    </mat-form-field>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TipoDeCalculoFieldComponent implements OnInit {
  @Input() tipos = ['PORCENTAJE', 'PRORRATEO', 'MANUAL'];
  @Input() property = 'tipoDeCalculo';
  @Input() parent: FormGroup;
  @Input() apparence: 'legacy' | 'standard' | 'fill' | 'outline' = 'standard';

  constructor() {}

  ngOnInit() {}
}
