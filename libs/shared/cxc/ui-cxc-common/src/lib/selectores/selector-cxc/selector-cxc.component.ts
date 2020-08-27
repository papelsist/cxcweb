import { Component, OnInit, Inject, Input } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { throwError } from 'rxjs';
import { delay, switchMap, tap, finalize, catchError } from 'rxjs/operators';

import { CuentaPorCobrarDTO } from '@nx-papelsa/shared/utils/core-models';
import {
  ITdDataTableColumn,
  TdDataTableService,
} from '@covalent/core/data-table';
import { FormatService } from '@nx-papelsa/shared/utils/ui-common';
import { CxcService } from '@nx-papelsa/shared/cxc/data-acces';

@Component({
  selector: 'nx-papelsa-selector-cxc',
  template: `
    <ng-template
      tdLoading
      [tdLoadingUntil]="!loading"
      tdLoadingStrategy="overlay"
    >
      <div fxLayout fxLayoutAlign="start center">
        <span class="mat-title">Cuentas por cobrar</span>
        <span fxFlex></span>

        <td-search-box
          placeholder="Filtrar"
          (searchDebounce)="filter($event)"
          [alwaysVisible]="true"
          fxFlex
        ></td-search-box>

        <td-search-box
          placeholder="Documento"
          (search)="search($event)"
          (clear)="clearSearch($event)"
          placeholder="Buscar por documento"
          searchIcon="find_in_page"
          backIcon="find_in_page"
          fxFlex
        ></td-search-box>
      </div>

      <mat-divider></mat-divider>

      <mat-dialog-content>
        <td-data-table
          #dataTable
          [data]="filteredData"
          [columns]="columns"
          [selectable]="true"
          [multiple]="multiple"
          [clickable]="clickable"
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
    </ng-template>
  `,
})
export class SelectorCxcComponent implements OnInit {
  @Input() columns: ITdDataTableColumn[] = [
    { name: 'sucursal', label: 'Sucursal', width: 120 },
    { name: 'tipo', label: 'Tipo', width: 100 },
    { name: 'tipoDocumento', label: 'Origen', width: 100 },
    { name: 'documento', label: 'Docto', width: 110 },
    { name: 'fecha', label: 'Fecha', width: 100 },
    { name: 'moneda', label: 'Mon', width: 90 },
    {
      name: 'total',
      label: 'Total',
      width: 110,
      format: (value) => this.format.formatCurrency(value),
    },
    {
      name: 'pagos',
      label: 'Pagos',
      width: 110,
      format: (value) => this.format.formatCurrency(value),
    },
    {
      name: 'saldo',
      label: 'Saldo',
      width: 110,
      format: (value) => this.format.formatCurrency(value),
    },
    { name: 'atraso', label: 'Atraso', width: 110 },
  ];

  selectedRows: any[] = [];
  facturas: any[] = [];

  @Input() clickable = true;
  @Input() multiple = true;
  @Input() clienteId: string;
  filterTerm = '';
  filteredTotal: number;
  filteredData: any[];
  loading = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<SelectorCxcComponent, CuentaPorCobrarDTO[]>,
    private format: FormatService,
    private _dataTableService: TdDataTableService,
    private service: CxcService
  ) {
    this.facturas = data.facturas;
    this.clienteId = data.clienteId;
  }

  ngOnInit() {
    this.refreshTable();
  }

  doSubmit() {
    this.dialogRef.close(this.selectedRows);
  }

  compareWith(row: CuentaPorCobrarDTO, model: CuentaPorCobrarDTO): boolean {
    return row.id === model.id; // or any property you want to compare by.
  }

  filter(filterTerm: string): void {
    this.filterTerm = filterTerm;
    this.refreshTable();
  }

  search(documento: string) {
    console.log('Buscar documento: %s', documento);
    this.findInBackend(documento);
  }

  clearSearch(event: any) {
    console.log('Clear search');
    this.facturas = this.data.facturas;
    this.refreshTable();
  }

  findInBackend(documento: string) {
    this.loading = true;
    this.service
      .search({ clienteId: this.clienteId, documento })
      .pipe(
        delay(500),
        finalize(() => (this.loading = false)),
        catchError((error: any) => throwError(error))
      )
      .subscribe(
        (facturas) => {
          this.filterTerm = '';
          this.facturas = facturas;
          this.refreshTable();
        },
        (error) => console.error('Error ', error)
      );
  }

  refreshTable(): void {
    let newData: any[] = this.facturas;
    const excludedColumns: string[] = this.columns
      .filter((column: ITdDataTableColumn) => {
        return (
          (column.filter === undefined && column.hidden === true) ||
          (column.filter !== undefined && column.filter === false)
        );
      })
      .map((column: ITdDataTableColumn) => {
        return column.name;
      });
    newData = this._dataTableService.filterData(
      newData,
      this.filterTerm,
      true,
      excludedColumns
    );
    this.filteredTotal = newData.length;
    this.filteredData = newData;
  }
}
