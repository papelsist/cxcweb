import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Periodo } from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'papx-cxc-facturas-con-dev',
  template: `
    <form [formGroup]="form" novalidate (ngSubmit)="doAccept()">
      <h4 md-dialog-title>
        Facturas con nota de devolución
      </h4>

      <div fxLayout="column" class="selector-form">
        <nx-papelsa-sucursal-field [parent]="form"></nx-papelsa-sucursal-field>
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

        <mat-form-field>
          <mat-select formControlName="origen">
            <mat-option value="CON">CONTADO</mat-option>
            <mat-option value="CRE">CREDITO</mat-option>
            <mat-option value="TOD">TODOS</mat-option>
          </mat-select>
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
export class FacturasConDevDialogComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FacturasConDevDialogComponent>
  ) {}

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
