import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

import { FormGroup } from '@angular/forms';
import { BONIFICACIONES_CONCEPTOS } from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'nx-papelsa-bonificacion-concepto',
  template: `
    <mat-form-field
      [formGroup]="parent"
      [appearance]="apparence"
      [style.width.%]="100"
    >
      <mat-label>Concepto</mat-label>
      <mat-select placeholder="F. Pago" formControlName="concepto">
        <mat-option *ngFor="let f of conceptos" [value]="f">
          {{ f }}
        </mat-option>
      </mat-select>
      <mat-error>Debe seleccionar un concepto</mat-error>
    </mat-form-field>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BonificacionConceptoFieldComponent implements OnInit {
  @Input() conceptos = BONIFICACIONES_CONCEPTOS;

  @Input() parent: FormGroup;
  @Input() apparence: 'legacy' | 'standard' | 'fill' | 'outline' = 'standard';

  constructor() {}

  ngOnInit() {}
}
