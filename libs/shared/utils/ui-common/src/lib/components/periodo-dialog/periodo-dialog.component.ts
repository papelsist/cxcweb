import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Periodo } from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'nx-papelsa-periodo-dialog',
  template: `
    <h2 mat-dialog-title>{{ title }}</h2>
    <p>{{ subtitle }}</p>

    <mat-dialog-content>
      <form
        [formGroup]="form"
        fxLayout
        fxLayoutAlign="center center"
        fxLayoutGap="5px"
      >
        <mat-form-field>
          <input
            matInput
            [matDatepicker]="myDatepicker"
            placeholder="Fecha inicial"
            formControlName="fechaInicial"
          />
          <mat-datepicker-toggle
            matSuffix
            [for]="myDatepicker"
          ></mat-datepicker-toggle>
          <mat-datepicker #myDatepicker></mat-datepicker>
        </mat-form-field>
        <mat-form-field>
          <input
            matInput
            [matDatepicker]="myDatepicker2"
            placeholder="Fecha final"
            formControlName="fechaFinal"
          />
          <mat-datepicker-toggle
            matSuffix
            [for]="myDatepicker2"
          ></mat-datepicker-toggle>
          <mat-datepicker #myDatepicker2></mat-datepicker>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-button (click)="doSubmit()" [disabled]="form.invalid">
        Aceptar
      </button>
    </mat-dialog-actions>
  `,
})
export class PeriodoDialogComponent implements OnInit {
  periodo: Periodo;
  form: FormGroup;
  title: string;
  subtitle: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PeriodoDialogComponent>,
    private fb: FormBuilder
  ) {
    this.title = data.title || 'Reporte por periodo';
    this.subtitle = data.subtitle || 'Seleccione el periodo ';
    this.periodo = data.periodo || new Periodo();
    this.buildForm();
    this.form.setValue(this.periodo);
  }

  buildForm() {
    this.form = this.fb.group({
      fechaInicial: [new Date().toISOString(), Validators.required],
      fechaFinal: [new Date().toISOString(), Validators.required],
    });
  }

  doSubmit() {
    if (this.form.valid) {
      const fechaInicial = this.form.get('fechaInicial').value as Date;
      const fechaFinal = this.form.get('fechaFinal').value as Date;
      this.dialogRef.close(new Periodo(fechaInicial, fechaFinal));
    }
  }

  ngOnInit() {}
}
