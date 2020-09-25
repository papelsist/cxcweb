import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'nx-papelsa-mes-field',
  template: `
    <mat-form-field
      [formGroup]="parent"
      [appearance]="appearance"
      [style.width.%]="100"
    >
      <mat-label>{{ label }}</mat-label>
      <mat-select placeholder="Mes" [formControlName]="property">
        <mat-option *ngFor="let mes of meses" [value]="mes.clave"
          >{{ mes.descripcion }}
        </mat-option>
      </mat-select>
    </mat-form-field>
  `,
  styles: [],
})
export class MesFieldComponent implements OnInit {
  @Input() parent: FormGroup;
  @Input() property = 'mes';
  @Input() label = 'Mes';
  @Input() appearance: 'legacy' | 'standard' | 'fill' | 'outline' = 'standard';

  meses = [
    { clave: 1, descripcion: 'Enero' },
    { clave: 2, descripcion: 'Febrero' },
    { clave: 3, descripcion: 'Marzo' },
    { clave: 4, descripcion: 'Abril' },
    { clave: 5, descripcion: 'Mayo' },
    { clave: 6, descripcion: 'Junio' },
    { clave: 7, descripcion: 'Julio' },
    { clave: 8, descripcion: 'Agosto' },
    { clave: 9, descripcion: 'Septiembre' },
    { clave: 10, descripcion: 'Octubre' },
    { clave: 11, descripcion: 'Noviembre' },
    { clave: 12, descripcion: 'Diciembre' },
  ];

  constructor() {}

  ngOnInit() {}
}
