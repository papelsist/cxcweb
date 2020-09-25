import { Component, Inject, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Periodo } from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'papx-cxc-sucursal-periodo',
  template: `
    <form [formGroup]="form" novalidate (ngSubmit)="doAccept()">
      <h4 md-dialog-title>
        {{ title }}
      </h4>

      <div>
        <nx-papelsa-sucursal-field [parent]="form"></nx-papelsa-sucursal-field>
        <div fxLayout fxLayoutGap="5px">
          <mat-form-field flex>
            <input
              matInput
              [matDatepicker]="picker"
              placeholder="Fecha ini"
              formControlName="fechaIni"
            />
            <mat-datepicker-toggle
              matSuffix
              [for]="picker"
            ></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
          <mat-form-field flex>
            <input
              matInput
              [matDatepicker]="picker2"
              placeholder="Fecha fin"
              formControlName="fechaFin"
            />
            <mat-datepicker-toggle
              matSuffix
              [for]="picker2"
            ></mat-datepicker-toggle>
            <mat-datepicker #picker2></mat-datepicker>
          </mat-form-field>
        </div>
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
export class SucursalPeriodoDialogComponent implements OnInit {
  form: FormGroup;
  title: string;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SucursalPeriodoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data
  ) {
    this.title = data.title;
  }

  ngOnInit() {
    const periodo = Periodo.mesActual();
    this.form = this.fb.group({
      fechaIni: [periodo.fechaInicial, Validators.required],
      fechaFin: [new Date(), Validators.required],
      sucursal: [null],
      origen: ['CON', Validators.required],
    });
  }

  close() {
    this.dialogRef.close();
  }

  doAccept() {
    const fechaIni: Date = this.form.get('fechaIni').value;
    const fechaFin: Date = this.form.get('fechaFin').value;
    const sucursal = this.form.get('sucursal').value;
    const res = {
      fechaIni: fechaIni.toISOString(),
      fechaFin: fechaFin.toISOString(),
      sucursal: sucursal ? sucursal.id : null,
      origen: this.form.get('origen').value,
    };
    this.dialogRef.close(res);
  }
}
