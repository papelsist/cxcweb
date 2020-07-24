import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import {
  NotaDeCargoCreateDto,
  Cartera,
  SAT_FORMAS_DE_PAGO,
} from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'nx-papelsa-bonificacion-create-dialog',
  template: `
    <div mat-dialog-title>
      Alta de Nota de bonificación ({{ cartera.descripcion }})
    </div>

    <mat-dialog-content
      class="form-container"
      fxLayout="column"
      fxLayoutAlign="center"
      [formGroup]="form"
    >
      <nx-papelsa-cliente-field
        formControlName="cliente"
        [tipo]="cartera.clave === 'CRE' ? 'CREDITO' : 'TODOS'"
      ></nx-papelsa-cliente-field>

      <div fxFlex fxLayout fxLayoutAlign="start center" fxLayoutGap="5px">
        <nx-papelsa-bonificacion-concepto
          [parent]="form"
          fxFlex
        ></nx-papelsa-bonificacion-concepto>

        <nx-papelsa-forma-de-pago-sat
          [parent]="form"
          fxFlex
        ></nx-papelsa-forma-de-pago-sat>

        <nx-papelsa-moneda-field
          [parent]="form"
          fxFlex
        ></nx-papelsa-moneda-field>
      </div>

      <nx-papelsa-uso-cfdi [parent]="form" fxFlex></nx-papelsa-uso-cfdi>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-flat-button [mat-dialog-close]>Cancelar</button>
      <button
        mat-flat-button
        color="accent"
        (click)="onSubmit()"
        [disabled]="form.invalid"
      >
        <mat-icon>save</mat-icon>
        <span>Salvar</span>
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
export class BonificacionCreateDialogComponent implements OnInit {
  form: FormGroup;
  cartera: Cartera;

  constructor(
    private dialogRef: MatDialogRef<
      BonificacionCreateDialogComponent,
      NotaDeCargoCreateDto
    >,
    @Inject(MAT_DIALOG_DATA) data: any,
    private fb: FormBuilder
  ) {
    this.cartera = data.cartera;
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      tipoCartera: [this.cartera.clave, [Validators.required]],
      tipo: ['BONIFICACION'],
      serie: [`BON${this.cartera.clave}`],
      cliente: [null, [Validators.required]],
      formaDePago: [SAT_FORMAS_DE_PAGO.POR_DEFINIR.clave, Validators.required],
      usoDeCfdi: ['G01', [Validators.required]],
      moneda: ['MXN', [Validators.required]],
      concepto: [null, [Validators.required]],
      comentario: [],
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
