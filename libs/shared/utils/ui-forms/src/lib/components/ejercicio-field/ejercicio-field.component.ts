import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'nx-papelsa-ejercicio-field',
  template: `
    <mat-form-field
      [formGroup]="parent"
      [appearance]="appearance"
      [style.width.%]="100"
    >
      <mat-label>Año</mat-label>
      <mat-select placeholder="Año" [formControlName]="property">
        <mat-option *ngFor="let ejercicio of ejercicios" [value]="ejercicio"
          >{{ ejercicio }}
        </mat-option>
      </mat-select>
    </mat-form-field>
  `,
  styles: [],
})
export class EjercicioFieldComponent implements OnInit {
  @Input() parent: FormGroup;
  @Input() property = 'ejercicio';
  @Input() appearance: 'legacy' | 'standard' | 'fill' | 'outline' = 'standard';

  ejercicios = [2017, 2018, 2019, 2020, 2021];

  constructor() {}

  ngOnInit() {}
}
