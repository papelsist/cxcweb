import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'papx-cxc-antiguedad-cte',
  template: `
    <form [formGroup]="form" novalidate (ngSubmit)="doAccept()">
      <h4 md-dialog-title>
        Estado de cuenta
      </h4>
      <p>
        {{ cliente }}
      </p>

      <div>
        <mat-form-field>
          <mat-label>Cartera</mat-label>
          <mat-select placeholder="Cartera" formControlName="cartera">
            <mat-option *ngFor="let c of carteras" [value]="c.clave"
              >{{ c.descripcion }}
            </mat-option>
          </mat-select>
        </mat-form-field>
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
export class EstadoDeCuentaDialogComponent implements OnInit {
  form: FormGroup;
  cliente: string;
  fecha: Date;
  carteras = [
    {
      clave: 'CRE',
      descripcion: 'Crédito',
    },
    {
      clave: 'CHE',
      descripcion: 'Cheques',
    },
    {
      clave: 'JUR',
      descripcion: 'Jurídico',
    },
    {
      clave: 'CHO',
      descripcion: 'Choferes',
    },
  ];

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRef: MatDialogRef<EstadoDeCuentaDialogComponent>
  ) {
    const {
      cliente: { nombre },
      fecha,
    } = data;
    this.cliente = nombre;
    this.fecha = fecha;
  }

  ngOnInit() {
    this.form = this.fb.group({
      fecha: [this.fecha, Validators.required],
      cartera: ['CRE', Validators.required],
    });
  }

  close() {
    this.dialogRef.close();
  }

  doAccept() {
    if (this.form.valid) {
      const fecha: Date = this.form.get('fecha').value;
      const res = {
        ...this.form.value,
        fecha: fecha.toISOString(),
      };
      this.dialogRef.close(res);
    }
  }
}
