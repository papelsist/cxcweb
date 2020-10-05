import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  Inject,
  LOCALE_ID,
} from '@angular/core';
import { formatCurrency, formatDate } from '@angular/common';

import { GridApi, ColumnApi, ColDef, GridOptions } from 'ag-grid-community';

import {
  Cfdi,
  formatFormaDePago,
  formatTipoDocto,
  formatUUID,
} from '@nx-papelsa/shared/utils/core-models';

import { AgGridText } from '@nx-papelsa/shared/utils/ui-common';

@Component({
  selector: 'nx-papelsa-cliente-cfdis-grid',
  template: `
    <div class="grid-container">
      <ag-grid-angular
        #agGrid
        class="ag-theme-alpine grid"
        style="width: 100%; height: 100%;"
        [rowData]="rows"
        [columnDefs]="columnDefs"
        [defaultColDef]="defaultColDef"
        [gridOptions]="gridOptions"
        rowSelection="multiple"
        [rowMultiSelectWithClick]="true"
        (selectionChanged)="onChangeSelection($event)"
        (gridReady)="onGridReady($event)"
        (modelUpdated)="onModelUpdated($event)"
        [quickFilterText]="searchTerm"
        [rowClassRules]="rowClassRules"
        [pinnedBottomRowData]="pinnedBottomRowData"
      >
      </ag-grid-angular>
    </div>
  `,
  styles: [
    `
      .grid-container {
        display: flex;
        flex-direction: column;
        height: 95%;

        .grid {
          flex: 1 1 auto;
          width: 100%;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClienteCfdisGridComponent implements OnInit {
  @Input() rows: Cfdi[];
  @Input() columnDefs = this.buildColumnDef();
  @Input() searchTerm: string;

  @Output() selectionChange = new EventEmitter<Cfdi[]>();
  @Output() drillDown = new EventEmitter<Cfdi>();
  @Output() print = new EventEmitter<Cfdi>();
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  gridOptions: GridOptions;
  defaultColDef;
  rowClassRules;
  pinnedBottomRowData;

  constructor(@Inject(LOCALE_ID) private locale: string) {
    this.rowClassRules = {
      'danger-row': ({ data: { cancelado } }) => cancelado,
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
      width: 120,
      sortable: true,
      resizable: true,
    };

    this.gridOptions.getRowStyle = this.buildRowStyle.bind(this);

    this.gridOptions.onRowDoubleClicked = (event) => {
      event.api.deselectAll();
      this.drillDown.emit(event.data);
    };

    this.gridOptions.onCellClicked = (event) => {
      if (event.colDef.colId === 'print') {
        event.api.deselectAll();
        this.print.emit(event.data);
      }
    };
    this.gridOptions.rowClass = 'medium-row';
    this.gridOptions.rowHeight = 35;
    this.gridOptions.headerHeight = 35;
    this.gridOptions.suppressCellSelection = true;
    this.gridOptions.localeText = AgGridText;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onModelUpdated(event) {
    if (this.gridApi) {
      // this.gridApi.sizeColumnsToFit();
      this.gridColumnApi.autoSizeAllColumns();
      this.actualizarTotales();
      this.actualizarSeleccion();
    }
  }

  actualizarTotales() {
    const totales = {
      total: 0.0,
      count: 0,
    };
    if (this.gridApi) {
      this.gridApi.forEachNodeAfterFilter(({ data }, index) => {
        Object.keys(totales).forEach((key) => {
          const v = data[key];
          if (v && typeof v === 'number') {
            totales[key] += v;
          }
        });
        totales.count++;
      });
    }

    const res = [
      {
        ...totales,
        folio: `Registros: ${totales.count}`,
      },
    ];
    if (this.gridApi) {
      this.gridApi.setPinnedBottomRowData(res);
    }
  }

  private actualizarSeleccion() {}

  onChangeSelection(event) {
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    this.selectionChange.emit(selectedData);
  }

  buildRowStyle(params: any) {
    if (params.node.rowPinned) {
      return { 'font-weight': 'bold' };
    }
    if (params.data.cancelado) {
      return {
        'font-weight': 'bold',
        'font-style': 'italic',
        color: 'rgb(190, 26, 26)',
      };
    }
  }

  clearSelection() {
    this.gridApi.deselectAll();
  }

  formatCurrency(data: any) {
    return formatCurrency(data, this.locale, '$');
  }

  formatDate(data: any, format: string = 'dd/MM/yyyy') {
    if (data) {
      return formatDate(data, format, this.locale);
    } else {
      return '';
    }
  }

  private buildColumnDef(): ColDef[] {
    return [
      {
        headerName: 'Folio',
        field: 'folio',
        // width: 110,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        valueFormatter: (params) => formatTipoDocto(params.value),
      },
      {
        headerName: 'Serie',
        field: 'serie',
        width: 120,
      },
      {
        headerName: 'Fecha',
        field: 'fecha',
        width: 120,
        valueFormatter: (params) => this.formatDate(params.value),
      },
      {
        headerName: 'Origen',
        field: 'origen',
        width: 120,
      },

      {
        headerName: 'Tipo',
        field: 'tipoDeComprobante',
        width: 110,
      },
      {
        headerName: 'Total',
        field: 'total',
        width: 160,
        valueFormatter: (params) => this.formatCurrency(params.value),
      },
      {
        headerName: 'CFDI',
        field: 'uuid',
        width: 100,
        valueFormatter: (params) =>
          params.value ? formatUUID(params.value) : '',
      },
      {
        headerName: 'enviado',
        field: 'enviado',
        width: 115,
        valueFormatter: (params) => this.formatDate(params.value),
      },
      {
        headerName: 'Detino',
        field: 'email',
        width: 200,
      },
      {
        headerName: 'Comentario',
        field: 'cancelado',
        valueFormatter: (params) => (params.data.cancelado ? 'CANCELADO' : ''),
      },
    ];
  }
}
