import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VentasPorClienteComponent } from './ventas-por-cliente.component';

@Component({
  selector: 'papx-cxc-ventas-por-linea-cte',
  template: `
    <div mat-dialog-title>{{ title }}</div>

    <div
      class="form-container"
      fxLayout="column"
      fxLayoutAlign="center"
      [formGroup]="form"
    >
      <div>
        <nx-papelsa-cliente-field formControlName="cliente">
        </nx-papelsa-cliente-field>
      </div>
      <div fxLayout fxLayoutGap="5px">
        <nx-papelsa-mes-field
          [parent]="form"
          property="mesInicial"
          label="Mes Ini"
        ></nx-papelsa-mes-field>
        <nx-papelsa-mes-field
          [parent]="form"
          property="mesFinal"
          label="Mes Fin"
        ></nx-papelsa-mes-field>
      </div>

      <div fxLayout fxLayoutGap="5px">
        <nx-papelsa-ejercicio-field
          [parent]="form"
          property="ejercicioInicial"
          label="Ejercicio Ini"
        ></nx-papelsa-ejercicio-field>
        <nx-papelsa-ejercicio-field
          [parent]="form"
          property="ejercicioFinal"
          label="Ejercicio Fin"
        ></nx-papelsa-ejercicio-field>
      </div>

      <div fxLayout fxLayoutGap="5px">
        <mat-form-field>
          <mat-label>Origen</mat-label>
          <mat-select placeholder="Origen" formControlName="origen">
            <mat-option
              *ngFor="let item of ['CREDITO', 'CONTADO', 'TODOS']"
              [value]="item"
              >{{ item }}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <mat-checkbox formControlName="kilos">Kilos</mat-checkbox>
      </div>
    </div>
    <mat-dialog-actions>
      <button mat-flat-button [mat-dialog-close]>Cancelar</button>
      <button
        mat-flat-button
        color="accent"
        (click)="onSubmit()"
        [disabled]="form.invalid"
      >
        <mat-icon>play_arrow</mat-icon>
        <span>Ejecutar</span>
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .form-container {
        width: 700px;
      }
    `,
  ],
})
export class VentasPorLineaClienteComponent implements OnInit {
  title = 'Reporte: Ventas por Línea - Cliente';
  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<VentasPorClienteComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      cliente: [null, [Validators.required]],
      mesInicial: [8, [Validators.required]],
      mesFinal: [7, [Validators.required]],
      ejercicioInicial: [2020, [Validators.required]],
      ejercicioFinal: [2020, [Validators.required]],
      origen: ['CREDITO', [Validators.required]],
      kilos: [true],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const value = this.form.getRawValue();
      this.dialogRef.close({
        ...value,
        cliente: value.cliente ? value.cliente.id : '%',
      });
    }
  }
}
