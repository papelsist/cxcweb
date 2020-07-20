import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'nx-papelsa-tipo-de-cambio-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container [formGroup]="parent" [style.width.px]="100">
      <mat-form-field>
        <input
          matInput
          placeholder="Tipo de cambio"
          type="number"
          [formControlName]="property"
        />
      </mat-form-field>
    </ng-container>
  `,
  styles: [``],
})
export class TipoDeCambioFieldComponent implements OnInit, OnDestroy {
  @Input() parent: FormGroup;
  @Input() property = 'tipoDeCambio';
  @Input() monedaField = 'moneda';
  subscription: Subscription;

  constructor() {}

  ngOnInit() {
    if (this.monedaField) {
      this.subscription = this.parent
        .get(`${this.monedaField}`)
        .valueChanges.pipe(startWith('MXN'))
        .subscribe((moneda) => this.applyMoneda(moneda));
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private applyMoneda(moneda: string) {
    if (moneda !== 'MXN') {
      this.parent.get(`${this.property}`).enable();
    } else {
      this.parent.get(`${this.property}`).disable();
    }
  }
}
