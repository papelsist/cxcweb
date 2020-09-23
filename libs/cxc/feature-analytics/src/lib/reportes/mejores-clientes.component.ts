import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'papx-cxc-mejores-clientes',
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
          <mat-label>No de Clientes</mat-label>
          <input
            type="number"
            matInput
            formControlName="numeroDeClientes"
            placeholder="Numero de clientes"
          />
        </mat-form-field>
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
export class MejoresClientesComponent implements OnInit {
  title = 'Reporte de Mejores clientes';
  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<MejoresClientesComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      fechaInicial: [null, [Validators.required]],
      fechaFinal: [null, [Validators.required]],
      origen: ['CREDITO', [Validators.required]],
      numeroDeClientes: [50],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const value = this.form.getRawValue();
      const {
        cliente: { id },
      } = value;
      const res = { ...value, cliente: { id } };
      this.dialogRef.close(res);
    }
  }
}
