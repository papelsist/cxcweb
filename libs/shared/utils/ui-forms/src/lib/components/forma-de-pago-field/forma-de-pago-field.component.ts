import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

import { FormGroup } from '@angular/forms';
import { FormaDePago } from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'nx-papelsa-forma-de-pago',
  template: `
    <mat-form-field [formGroup]="parent" [appearance]="apparence">
      <mat-label>Forma de pago</mat-label>
      <mat-select
        placeholder="F. Pago"
        formControlName="formaDePago"
        [compareWith]="compareWith"
      >
        <mat-option *ngFor="let f of formasDePago" [value]="f">
          {{ f }}
        </mat-option>
      </mat-select>
    </mat-form-field>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FomraDePagoFieldComponent implements OnInit {
  @Input() formasDePago = [
    FormaDePago.EFECTIVO,
    FormaDePago.TRANSFERENCIA,
    FormaDePago.DEPOSITO_EFECTIVO,
    FormaDePago.DEPOSITO_CHEQUE,
    FormaDePago.DEPOSITO_MIXTO,
    FormaDePago.TARJETA_CRE,
    FormaDePago.TARJETA_DEB,
    FormaDePago.CHEQUE,
    FormaDePago.CHEQUE_PSTF,
    FormaDePago.POR_DEFINIR,
  ];
  @Input() parent: FormGroup;
  @Input() apparence: 'legacy' | 'standard' | 'fill' | 'outline' = 'standard';

  constructor() {}

  ngOnInit() {}

  /**
   * Small fix temporal algunos registros en la base de datos están en POR DEFINIR en
   * lugar de POR_DEFINIR
   *
   * @param o1
   * @param o2
   */
  compareWith(o1: any, o2: any) {
    if (o2 === 'POR DEFINIR') {
      o2 = 'POR_DEFINIR';
    }
    return o1 === o2;
  }
}
