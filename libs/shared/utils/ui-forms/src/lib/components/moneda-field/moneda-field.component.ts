import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'nx-papelsa-moneda-field',
  template: `
    <mat-form-field [formGroup]="parent" [appearance]="appearance">
      <mat-label>Moneda</mat-label>
      <mat-select placeholder="Moneda" [formControlName]="property">
        <mat-option *ngFor="let moneda of monedas" [value]="moneda.clave"
          >{{ moneda.descripcion }}
        </mat-option>
      </mat-select>
    </mat-form-field>
  `,
  styles: [],
})
export class MonedaFieldComponent implements OnInit {
  @Input() parent: FormGroup;
  @Input() property = 'moneda';
  @Input() appearance: 'legacy' | 'standard' | 'fill' | 'outline' = 'standard';

  monedas = [
    { clave: 'MXN', descripcion: 'PESOS (MXN)' },
    { clave: 'USD', descripcion: 'DOLARES (USD)' },
  ];

  constructor() {}

  ngOnInit() {}
}
