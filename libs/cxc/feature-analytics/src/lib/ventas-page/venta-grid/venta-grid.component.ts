import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import { GridApi, ColumnApi, ColDef, GridOptions } from 'ag-grid-community';

import { FormatService, AgGridText } from '@nx-papelsa/shared/utils/ui-common';

import { VentaMensual } from '../ventas-models';

@Component({
  selector: 'papx-cxc-venta-grid',
  template: `
    <ag-grid-angular
      #agGrid
      class="ag-theme-alpine"
      style="width: 100%; height: 100%;"
      [rowData]="rows"
      [columnDefs]="columnDefs"
      [gridOptions]="gridOptions"
      rowSelection="multiple"
      [rowMultiSelectWithClick]="true"
      (selectionChanged)="onChangeSelection($event)"
      (gridReady)="onGridReady($event)"
      (modelUpdated)="onModelUpdated($event)"
      [quickFilterText]="searchTerm"
      (firstDataRendered)="onFirstDataRendered($event)"
      [rowClassRules]="rowClassRules"
      [defaultColDef]="defaultColDef"
      [pinnedBottomRowData]="pinnedBottomRowData"
    >
    </ag-grid-angular>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VentaGridComponent implements OnInit {
  private _rows: VentaMensual[];
  columnDefs = this.buildColumnDef();

  @Input() searchTerm: string;
  @Input() selectedRows = [];
  @Output() selectionChange = new EventEmitter<VentaMensual[]>(); // Single selection
  @Output() drillDown = new EventEmitter<VentaMensual>();

  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  gridOptions: GridOptions;
  defaultColDef;
  rowClassRules;
  pinnedBottomRowData;
  exportKey = 'EX';

  constructor(private formatService: FormatService) {
    this.rowClassRules = {};
  }

  ngOnInit(): void {
    this.buildGridOptions();
  }

  buildGridOptions() {
    this.gridOptions = <GridOptions>{};

    this.defaultColDef = {
      editable: false,
      filter: 'agTextColumnFilter',
      width: 150,
      sortable: true,
      resizable: true,
    };
    this.gridOptions.onRowDoubleClicked = (event) => {
      this.drillDown.emit(event.data);
    };

    this.gridOptions.rowClass = 'medium-row';

    this.gridOptions.rowHeight = 35;
    this.gridOptions.headerHeight = 35;
    this.gridOptions.getRowStyle = this.buildRowStyle;
    this.gridOptions.localeText = AgGridText;
    // this.gridOptions.getRowNodeId = (data) => data.clienteId;
  }

  buildRowStyle(params: any) {
    if (params.node.rowPinned) {
      return { 'font-weight': 'bold' };
    }
    return {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onFirstDataRendered(params) {
    this.actualizarTotales();
  }

  onModelUpdated(event) {
    if (this.gridApi) {
      this.actualizarTotales();
      this.actualizarSeleccion();
    }
  }

  actualizarTotales() {
    const totales = {
      ventaNeta: 0.0,
      importeUtilidad: 0.0,
      costo: 0.0,
    };
    if (this.gridApi) {
      this.gridApi.forEachNodeAfterFilter(({ data }, index) => {
        Object.keys(totales).forEach((key) => {
          const v = data[key];
          if (v && typeof v === 'number') {
            totales[key] += v;
          }
        });
      });
    }
    const res = [
      {
        ...totales,
      },
    ];
    if (this.gridApi) {
      this.gridApi.setPinnedBottomRowData(res);
    }
  }

  onChangeSelection(event) {
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    this.selectionChange.emit(selectedData);
  }

  clearSelection() {
    this.gridApi.deselectAll();
  }

  private actualizarSeleccion() {
    if (this.selectedRows && this.selectedRows.length > 0) {
      this.selectedRows.forEach((row) => {
        const node = this.gridApi.getRowNode(row);
        if (!node.isSelected()) {
          node.selectThisNode(true);
        }
      });
    } else {
      if (this.gridApi.getSelectedRows().length > 0) {
        this.clearSelection();
      }
    }
  }

  formatCurrency(data: any) {
    return this.formatService.formatCurrency(data);
  }

  formatDate(data: any) {
    return this.formatService.formatDate(data);
  }

  @Input()
  get rows() {
    return this._rows;
  }
  set rows(value: any[]) {
    this._rows = value;
    // console.log('Rows:', this._rows);
  }

  exportData(prefix: string = this.exportKey) {
    const params = {
      fileName: `${prefix}_${new Date().getTime()}.csv`
    };
    this.gridApi.exportDataAsCsv(params);
  }

  private buildColumnDef(): ColDef[] {
    return [
      // {
      //   headerName: 'Ejercicio',
      //   field: 'ejercicio',
      //   checkboxSelection: true,
      //   minWidth: 100,
      //   pinned: 'left',
      //   pinnedRowCellRenderer: (params) => '',
      // },
      // {
      //   headerName: 'Mes',
      //   field: 'mes',
      //   checkboxSelection: true,
      //   minWidth: 100,
      //   pinned: 'left',
      //   pinnedRowCellRenderer: (params) => '',
      // },
      {
        headerName: 'Periodo',
        field: 'periodo',
        minWidth: 140,
        pinned: 'left',
        pinnedRowCellRenderer: (params) => '',
      },
      {
        headerName: 'Nombre',
        field: 'descripcion',
        width: 300,
      },
      {
        headerName: 'Venta',
        field: 'ventaNeta',
        width: 135,
        valueFormatter: (params) => this.formatCurrency(params.value),
      },
      {
        headerName: 'Costo',
        field: 'costo',
        width: 135,
        valueFormatter: (params) => this.formatCurrency(params.value),
      },
      {
        headerName: 'Utilidad',
        field: 'importeUtilidad',
        width: 135,
        valueFormatter: (params) => this.formatCurrency(params.value),
      },
      {
        headerName: '%',
        field: 'porcentajeUtilidad',
        width: 80,
        valueFormatter: (params) =>
          this.formatService.formatPercent((params.value || 0.0) / 100),
      },
      {
        headerName: 'Part(%)',
        field: 'participacion',
        width: 90,
        valueFormatter: (params) =>
          this.formatService.formatPercent(params.value || 0.0),
      },
    ];
  }
}
