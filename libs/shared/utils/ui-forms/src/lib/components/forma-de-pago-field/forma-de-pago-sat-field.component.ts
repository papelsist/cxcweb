import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

import { FormGroup } from '@angular/forms';
import { FORMAS_DE_PAGO_SAT } from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'nx-papelsa-forma-de-pago-sat',
  template: `
    <mat-form-field
      [formGroup]="parent"
      [appearance]="apparence"
      [style.width.%]="100"
    >
      <mat-label>Forma de pago</mat-label>
      <mat-select placeholder="F. Pago" formControlName="formaDePago">
        <mat-option *ngFor="let f of formasDePago" [value]="f.clave">
          {{ f.descripcion }}
        </mat-option>
      </mat-select>
    </mat-form-field>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FomraDePagoSatFieldComponent implements OnInit {
  @Input() formasDePago = FORMAS_DE_PAGO_SAT;

  @Input() parent: FormGroup;
  @Input() apparence: 'legacy' | 'standard' | 'fill' | 'outline' = 'standard';

  constructor() {}

  ngOnInit() {}
}
