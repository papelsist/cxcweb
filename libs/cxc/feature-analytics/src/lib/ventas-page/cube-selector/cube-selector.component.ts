import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { VentaCommand } from '../ventas-models';

@Component({
  selector: 'papx-cxc-cube-selector',
  template: `
    <div [formGroup]="form">
      <nx-papelsa-ejercicio-field
        [parent]="form"
        [appearance]="apparence"
      ></nx-papelsa-ejercicio-field>
      <nx-papelsa-mes-field
        [parent]="form"
        [appearance]="apparence"
      ></nx-papelsa-mes-field>
      <mat-form-field [appearance]="apparence" [style.width.%]="100">
        <mat-label>Dimensión</mat-label>
        <mat-select placeholder="Dimensión" formControlName="slice">
          <mat-option
            *ngFor="
              let dim of [
                'LINEA',
                'CLIENTE',
                'PRODUCTO',
                'SUCURSAL',
                'VENTA',
                'MES'
              ]
            "
            [value]="dim"
            >{{ dim }}
          </mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field [appearance]="apparence" [style.width.%]="100">
        <mat-label>Tipo de Venta</mat-label>
        <mat-select placeholder="Tipo de venta" formControlName="tipoDeVenta">
          <mat-option
            *ngFor="let dim of ['CREDITO', 'CONTADO', 'TODOS']"
            [value]="dim"
            >{{ dim }}
          </mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field [appearance]="apparence" [style.width.%]="100">
        <mat-label>Tipo de producto</mat-label>
        <mat-select
          placeholder="Tipo de producto"
          formControlName="tipoDeProducto"
        >
          <mat-option
            *ngFor="let dim of ['NACIONAL', 'IMPORTADO', 'TODOS']"
            [value]="dim"
            >{{ dim }}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </div>
  `,
})
export class CubeSelectorComponent implements OnInit {
  @Input() command: VentaCommand;
  @Output() update = new EventEmitter<VentaCommand>();
  @Input() apparence = 'fill';

  form: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm(this.command);
  }

  private buildForm(command: VentaCommand) {
    this.form = this.fb.group({
      ejercicio: [command.ejercicio, [Validators.required]],
      mes: [command.mes, [Validators.required]],
      slice: [command.slice, [Validators.required]],
      tipoDeVenta: [command.tipoDeVenta, [Validators.required]],
      tipoDeProducto: [command.tipoDeProducto, [Validators.required]],
    });
  }

  submit() {
    if (this.form.valid) {
      this.update.emit(this.form.value);
    }
  }
}
