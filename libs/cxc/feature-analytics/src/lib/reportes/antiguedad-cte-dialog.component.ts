import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'papx-cxc-antiguedad-cte',
  template: `
    <form [formGroup]="form" novalidate (ngSubmit)="doAccept()">
      <h4 md-dialog-title>
        Antigüedad por cliente
      </h4>

      <div>
        <nx-papelsa-cliente-field
          tipo="CREDITO"
          formControlName="cliente"
        ></nx-papelsa-cliente-field>
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
export class AntiguedadCteDialogComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AntiguedadCteDialogComponent>
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      fecha: [new Date(), Validators.required],
      cliente: [null, Validators.required],
    });
  }

  close() {
    this.dialogRef.close();
  }

  doAccept() {
    const fecha: Date = this.form.get('fecha').value;
    const res = {
      fecha: fecha.toISOString(),
      cliente: this.form.get('cliente').value.id,
    };
    this.dialogRef.close(res);
  }
}
