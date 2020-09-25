import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Periodo } from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'papx-cxc-ventas-por-clientes',
  template: `
    <div mat-dialog-title>{{ title }}</div>

    <div
      class="form-container"
      fxLayout="column"
      fxLayoutAlign="center"
      [formGroup]="form"
    >
      <div fxLayout>
        <nx-papelsa-cliente-field
          formControlName="cliente"
          fxFlex
        ></nx-papelsa-cliente-field>
      </div>
      <div fxLayout fxLayoutGap="5px" fxLayoutAlign="start center">
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
        <mat-form-field fxFlex>
          <mat-label>Origen</mat-label>
          <mat-select placeholder="Origen" formControlName="origen">
            <mat-option *ngFor="let item of origenes" [value]="item.clave"
              >{{ item.descripcion }}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <nx-papelsa-sucursal-field
          [parent]="form"
          fxFlex
        ></nx-papelsa-sucursal-field>
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
export class VentasPorClienteComponent implements OnInit {
  title = 'Ventas por cliente';
  form: FormGroup;
  origenes = [
    { clave: 'CREDITO', descripcion: 'CREDITO' },
    { clave: 'TODOS', descripcion: 'TODOS' },
    { clave: 'CONONTADO', descripcion: 'CONTADO' },
  ];
  periodo = Periodo.fromNow(30);

  constructor(
    private dialogRef: MatDialogRef<VentasPorClienteComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private fb: FormBuilder
  ) {
    if (data) {
      this.origenes = data.origenes || [
        { clave: 'CREDITO', descripcion: 'CREDITO' },
        { clave: 'TODOS', descripcion: 'TODOS' },
        { clave: 'CONONTADO', descripcion: 'CONTADO' },
      ];
      this.periodo = data.periodo || Periodo.fromNow(30);
    }
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      cliente: [null],
      fechaInicial: [this.periodo.fechaInicial, [Validators.required]],
      fechaFinal: [this.periodo.fechaFinal, [Validators.required]],
      origen: [this.origenes[0].clave, [Validators.required]],
      sucursal: [null],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const value = this.form.getRawValue();

      const res = {
        ...value,
        cliente: value.cliente.id,
        fechaInicial: value.fechaInicial.toISOString(),
        fechaFinal: value.fechaFinal.toISOString(),
        origen: value.origen === 'TODOS' ? '%' : value.origen,
        sucursal: value.sucursal ? value.sucursal.id : '%',
      };
      this.dialogRef.close(res);
    }
  }
}
