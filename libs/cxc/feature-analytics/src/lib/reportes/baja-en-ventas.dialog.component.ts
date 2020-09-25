import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Periodo } from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'papx-cxc-baja-en-ventas-dialog',
  template: `
    <div mat-dialog-title>{{ title }}</div>

    <div
      class="form-container"
      fxLayout="column"
      fxLayoutAlign="center"
      [formGroup]="form"
    >
      <div fxLayout fxLayoutGap="5px">
        <nx-papelsa-fecha-field
          label="Fecha Inicial"
          formControlName="fechaInicial"
        ></nx-papelsa-fecha-field>
        <nx-papelsa-fecha-field
          label="Fecha Final"
          formControlName="fechaFinal"
        ></nx-papelsa-fecha-field>
      </div>
      <div fxLayout fxLayoutGap="5px">
        <mat-form-field>
          <mat-label>Orden</mat-label>
          <mat-select placeholder="Orden" formControlName="orden">
            <mat-option *ngFor="let item of ordenes" [value]="item.clave"
              >{{ item.descripcion }}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Forma</mat-label>
          <mat-select placeholder="Forma" formControlName="forma">
            <mat-option *ngFor="let item of ['DESC', 'ASC']" [value]="item"
              >{{ item }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div fxLayout fxLayoutGap="5px">
        <mat-form-field>
          <mat-label>Días</mat-label>
          <input type="number" matInput formControlName="dias" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Venta mayor a:</mat-label>
          <input
            type="number"
            matInput
            formControlName="valorVenta"
            placeholder="Mayor A"
          />
        </mat-form-field>
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
        <mat-form-field>
          <mat-label>Porcentaje</mat-label>
          <input
            type="number"
            matInput
            formControlName="porcentaje"
            placeholder="Porcentaje"
          />
        </mat-form-field>
      </div>
      <nx-papelsa-sucursal-field [parent]="form"></nx-papelsa-sucursal-field>
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
export class BajaEnVentaDialogComponent implements OnInit {
  title: string;
  form: FormGroup;
  periodo: Periodo;

  ordenes = [
    { clave: 5, descripcion: 'PROMEDIO' },
    { clave: 7, descripcion: 'PORCENTAJE' },
    { clave: 1, descripcion: 'CLIENTE' },
    { clave: 3, descripcion: 'TIPO' },
    { clave: 6, descripcion: 'PERIODO' },
    { clave: 8, descripcion: 'ULT.VENTA' },
  ];

  constructor(
    private dialogRef: MatDialogRef<BajaEnVentaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private fb: FormBuilder
  ) {
    this.title = data.title || 'Reporte de Baja en Ventas';
    this.periodo = data.periodo || Periodo.fromNow(60);
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      fechaInicial: [this.periodo.fechaInicial, [Validators.required]],
      fechaFinal: [this.periodo.fechaFinal, [Validators.required]],
      orden: [5, [Validators.required]],
      forma: ['DESC', [Validators.required]],
      dias: [{ value: 30, disabled: true }],
      valorVenta: [50000, [Validators.required]],
      origen: ['CREDITO', [Validators.required]],
      porcentaje: [10.0, [Validators.min(1.0)]],
      sucursal: [null],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const value = this.form.getRawValue();
      const res = {
        ...value,
        fechaInicial: value.fechaInicial.toISOString(),
        fechaFinal: value.fechaFinal.toISOString(),
        sucursal: value.sucursal ? value.sucursal.id : '%',
      };
      this.dialogRef.close(res);
    }
  }
}
