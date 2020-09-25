import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'papx-cxc-reporte-cartera-cod',
  template: `
    <form [formGroup]="form" novalidate (ngSubmit)="doAccept()">
      <h4 md-dialog-title>
        Cartera de COD
      </h4>

      <div layout="column" class="selector-form">
        <mat-form-field flex>
          <input
            matInput
            [matDatepicker]="picker"
            placeholder="Fecha"
            formControlName="fecha"
          />
          <mat-datepicker-toggle
            matSuffix
            [for]="picker"
          ></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
        <nx-papelsa-sucursal-field [parent]="form"></nx-papelsa-sucursal-field>
      </div>

      <mat-dialog-actions>
        <button
          mat-button
          class="accent"
          type="submit"
          [disabled]="form.invalid"
        >
          Aceptar
        </button>
        <button mat-button type="button" (click)="close()">Cancelar</button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [],
})
export class CarteraCodDialogComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CarteraCodDialogComponent>
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      fecha: [new Date(), Validators.required],
      sucursal: [null, Validators.required],
    });
  }

  close() {
    this.dialogRef.close();
  }

  doAccept() {
    const fecha: Date = this.form.get('fecha').value;
    const res = {
      fecha: fecha.toISOString(),
      sucursal: this.form.get('sucursal').value.id,
    };
    this.dialogRef.close(res);
  }
}
