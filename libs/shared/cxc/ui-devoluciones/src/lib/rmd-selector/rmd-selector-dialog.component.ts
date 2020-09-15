import { Component, OnInit, Inject, Input } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Devolucion } from '@nx-papelsa/shared/utils/core-models';
import { ITdDataTableColumn } from '@covalent/core/data-table';
import { FormatService } from '@nx-papelsa/shared/utils/ui-common';

@Component({
  selector: 'nx-papelsa-selector-rmd',
  template: `
    <div mat-dialog-title>
      <span>RMDs Pendientes de nota</span>
    </div>
    <mat-divider></mat-divider>

    <mat-dialog-content>
      <td-data-table
        #dataTable
        [data]="rmds"
        [columns]="columns"
        [selectable]="true"
        [multiple]="multiple"
        [clickable]="clickable"
        (rowSelect)="onRowSelection($event)"
        [compareWith]="compareWith"
        [(ngModel)]="selectedRows"
      >
        <ng-template
          tdDataTableTemplate="parcial"
          let-index="index"
          let-value="value"
        >
          <mat-icon *ngIf="value">check</mat-icon>
        </ng-template>
      </td-data-table>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-stroked-button [mat-dialog-close]>Cerrar</button>
      <button
        mat-stroked-button
        color="primery"
        [disabled]="selectedRows.length === 0"
        (click)="doSubmit()"
      >
        <mat-icon>done</mat-icon>
        <span>Seleccionar</span>
      </button>
    </mat-dialog-actions>
  `,
})
export class RmdSelectorDialogComponent implements OnInit {
  selectedRows: Devolucion[] = [];
  rmds: Devolucion[] = [];

  @Input() columns: ITdDataTableColumn[] = [
    { name: 'documento', label: 'RMD', width: 110 },
    { name: 'sucursalNombre', label: 'Sucursal', width: 110 },
    {
      name: 'tipo',
      label: 'Tipo',
      width: 100,
    },
    {
      name: 'fecha',
      label: 'Fecha',
      width: 100,
      format: (value) => this.format.formatDate(value),
    },

    // { name: 'tipoDocumento', label: 'Origen', width: 100 },
    // { name: 'moneda', label: 'Mon', width: 90 },
    {
      name: 'importe',
      label: 'Importe',
      width: 110,
      format: (value) => this.format.formatCurrency(value),
    },
    {
      name: 'impuesto',
      label: 'Impuesto',
      width: 110,
      format: (value) => this.format.formatCurrency(value),
    },
    {
      name: 'total',
      label: 'Total',
      width: 110,
      format: (value) => this.format.formatCurrency(value),
    },
    {
      name: 'parcial',
      label: 'Parcial',
      width: 90,
    },
    { name: 'comentario', label: 'Comentario' },
  ];

  @Input() clickable = true;
  @Input() multiple = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<RmdSelectorDialogComponent, Devolucion[]>,
    private format: FormatService
  ) {
    this.rmds = data.rmds;
  }

  ngOnInit() {}

  doSubmit() {
    this.dialogRef.close(this.selectedRows);
  }

  compareWith(row: Devolucion, model: Devolucion): boolean {
    return row.id === model.id; // or any property you want to compare by.
  }

  onRowSelection(event) {
    // console.log('Row selected: ', event);
    // console.log('Selected sofar: ', this.selectedRows);
  }
}
