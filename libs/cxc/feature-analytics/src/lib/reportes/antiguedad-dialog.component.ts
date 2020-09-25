import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import * as moment from 'moment';

@Component({
  selector: 'papx-cxc-antiguedad-dialog',
  template: `
    <form [formGroup]="form" novalidate (ngSubmit)="doAccept()">
      <h4 md-dialog-title>
        Antigüedad de saldos
      </h4>

      <div fxLayout="column">
        <mat-form-field fxFlex>
          <input
            matInput
            [matDatepicker]="picker"
            placeholder="Corte"
            formControlName="fecha"
          />
          <mat-datepicker-toggle
            matSuffix
            [for]="picker"
          ></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
        <mat-form-field>
          <mat-select placeholder="Ordenado por" formControlName="sort">
            <mat-option *ngFor="let sort of SORT" [value]="sort">
              {{ sort.descripcion }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field>
          <mat-select placeholder="Forma" formControlName="order">
            <mat-option *ngFor="let forma of ORDER" [value]="forma">
              {{ forma }}
            </mat-option>
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
export class AntiguedadDialogComponent implements OnInit {
  form: FormGroup;

  SORT = [
    {
      clave: '1',
      descripcion: 'CLIENTE',
    },
    {
      clave: '6',
      descripcion: 'ATRASO_MAXIMO',
    },
    {
      clave: '7',
      descripcion: 'SALDO',
    },
    {
      clave: '8',
      descripcion: 'POR_VENCER',
    },
    {
      clave: '9',
      descripcion: 'VENCIDO',
    },
  ];

  ORDER = ['asc', 'desc'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AntiguedadDialogComponent>
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      fecha: [new Date(), Validators.required],
      sort: [this.SORT[0], Validators.required],
      order: [this.ORDER[0], Validators.required],
    });
  }

  close() {
    this.dialogRef.close();
  }

  doAccept() {
    const fecha: Date = this.form.get('fecha').value;
    const res = {
      ...this.form.value,
      sort: this.form.value.sort.clave,
      fecha: moment(fecha).format('DD/MM/YYYY'),
    };
    this.dialogRef.close(res);
  }
}
