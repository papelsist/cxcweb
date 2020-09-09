import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import {
  NotaDeCargoCreateDto,
  FormaDePago,
} from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'nx-papelsa-cargo-create-dialog',
  template: `
    <div mat-dialog-title>Alta de Nota de Cargo ({{ cartera.clave }})</div>

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

      <div fxFlex fxLayout fxLayoutGap="5px">
        <nx-papelsa-forma-de-pago
          [parent]="form"
          fxFlex
        ></nx-papelsa-forma-de-pago>
        <nx-papelsa-moneda-field
          [parent]="form"
          fxFlex
        ></nx-papelsa-moneda-field>
      </div>

      <nx-papelsa-uso-cfdi [parent]="form" fxFlex></nx-papelsa-uso-cfdi>

      <mat-form-field fxFlex>
        <input
          type="text"
          matInput
          placeholder="Comentario"
          formControlName="comentario"
        />
      </mat-form-field>
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
export class CreateCargoDialogComponent implements OnInit {
  form: FormGroup;

  // cartera: 'CRE' | 'CHE' | 'CHO';
  cartera: { clave: string; descripcion: string };

  constructor(
    private dialogRef: MatDialogRef<
      CreateCargoDialogComponent,
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
      tipo: [this.cartera.clave, [Validators.required]],
      cliente: [null, [Validators.required]],
      formaDePago: [FormaDePago.TRANSFERENCIA, Validators.required],
      usoDeCfdi: ['G01', [Validators.required]],
      moneda: ['MXN', [Validators.required]],
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
