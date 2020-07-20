import { Component, OnInit, Inject, Input } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CuentaPorCobrarDTO } from '@nx-papelsa/shared/utils/core-models';
import { ITdDataTableColumn } from '@covalent/core/data-table';

@Component({
  selector: 'nx-papelsa-selector-cxc',
  template: `
    <div mat-dialog-title>
      <span>Selector de Cuentas por cobrar</span>
    </div>
    <mat-dialog-content>
      <td-data-table
        #dataTable
        [data]="facturas"
        [columns]="columns"
        [selectable]="true"
        [multiple]="multiple"
        [clickable]="clickable"
        (rowSelect)="onRowSelection($event)"
        [compareWith]="compareWith"
        [(ngModel)]="selectedRows"
      >
        <ng-template
          tdDataTableTemplate="fecha"
          let-index="index"
          let-value="value"
        >
          {{ value | date: 'dd/MM/yyyy' }}
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
export class SelectorCxcComponent implements OnInit {
  selectedRows: CuentaPorCobrarDTO[] = [];
  facturas: CuentaPorCobrarDTO[] = [];

  @Input() columns: ITdDataTableColumn[] = [
    { name: 'sucursal', label: 'Sucursal', width: 110 },
    { name: 'tipo', label: 'Tipo', width: 100 },
    { name: 'documento', label: 'Docto', width: 110 },
    { name: 'fecha', label: 'Fecha', width: 110 },
  ];

  @Input() clickable = true;
  @Input() multiple = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<SelectorCxcComponent, CuentaPorCobrarDTO[]>
  ) {
    this.facturas = data.facturas;
  }

  ngOnInit() {}

  doSubmit() {
    this.dialogRef.close(this.selectedRows);
  }

  compareWith(row: CuentaPorCobrarDTO, model: CuentaPorCobrarDTO): boolean {
    return row.id === model.id; // or any property you want to compare by.
  }

  onRowSelection(event) {
    // console.log('Row selected: ', event);
    // console.log('Selected sofar: ', this.selectedRows);
  }
}
