import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import { GridApi, ColumnApi, ColDef, GridOptions } from 'ag-grid-community';
import { Antiguedad } from '../antiguedad-models';

import {
  AgBooleanRendererComponent,
  FormatService,
  AgGridText,
  agDateComparator,
} from '@nx-papelsa/shared/utils/ui-common';

@Component({
  selector: 'papx-cxc-antiguedad-grid',
  template: `
    <ag-grid-angular
      #agGrid
      class="ag-theme-alpine"
      style="width: 100%; height: 100%;"
      [rowData]="rows"
      [columnDefs]="columnDefs"
      [gridOptions]="gridOptions"
      rowSelection="single"
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
export class AntiguedadGridComponent implements OnInit {
  private _rows: Antiguedad[];
  @Input() columnDefs = this.buildColumnDef();
  @Input() searchTerm: string;
  @Input() selectedRows = [];
  @Output() selectionChange = new EventEmitter<Antiguedad[] | Antiguedad>(); // Single selection
  @Output() drillDown = new EventEmitter<Antiguedad>();
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  gridOptions: GridOptions;
  defaultColDef;
  rowClassRules;
  pinnedBottomRowData;

  constructor(private formatService: FormatService) {
    this.rowClassRules = {
      'warning-row': ({ data: { atrasoMaximo } }) =>
        atrasoMaximo > 0 && atrasoMaximo < 7,
      'danger-row': ({ data: { atrasoMaximo } }) => atrasoMaximo >= 7,
    };
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
    this.gridOptions.getRowNodeId = (data) => data.clienteId;
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
      saldo: 0.0,
      porVencer: 0.0,
      vencido: 0.0,
      de1_30: 0.0,
      de31_60: 0.0,
      de61_90: 0.0,
      mas90: 0.0,
      // part: 0.0,
      facturas: 0,
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
    this.selectionChange.emit(selectedData[0]); // Single selection
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

  private buildColumnDef(): ColDef[] {
    return [
      {
        headerName: 'Cliente',
        field: 'cliente',
        checkboxSelection: true,
        minWidth: 250,
        pinned: 'left',
        pinnedRowCellRenderer: (params) => '',
      },
      {
        headerName: 'Pzo',
        field: 'plazo',
        headerTooltip: 'Plazo',
        width: 100,
      },
      {
        headerName: 'Vto',
        field: 'tipoVencimiento',
        width: 90,
      },
      {
        headerName: 'Facs',
        field: 'facturas',
        width: 90,
      },
      {
        headerName: 'Atso Max',
        headerTooltip: 'Atraso máximo',
        field: 'atrasoMaximo',
        width: 90,
      },
      {
        headerName: 'Saldo',
        field: 'saldo',
        width: 145,
        valueFormatter: (params) => this.formatCurrency(params.value),
      },
      {
        headerName: 'X Vencer',
        field: 'porVencer',
        width: 145,
        valueFormatter: (params) => this.formatCurrency(params.value),
      },
      {
        headerName: 'Vencido',
        field: 'vencido',
        width: 145,
        valueFormatter: (params) => this.formatCurrency(params.value),
      },

      {
        headerName: '1 - 30',
        field: 'de1_30',
        width: 145,
        valueFormatter: (params) => this.formatCurrency(params.value),
      },
      {
        headerName: '31 - 60',
        field: 'de31_60',
        width: 145,
        valueFormatter: (params) => this.formatCurrency(params.value),
      },
      {
        headerName: '61 - 90',
        field: 'de61_90',
        width: 145,
        valueFormatter: (params) => this.formatCurrency(params.value),
      },
      {
        headerName: '90+',
        field: 'mas90',
        width: 145,
        valueFormatter: (params) => this.formatCurrency(params.value),
      },
      {
        headerName: 'Part',
        field: 'participacion',
        width: 110,
        valueFormatter: (params) =>
          this.formatService.formatPercent(params.value),
      },
    ];
  }
}
