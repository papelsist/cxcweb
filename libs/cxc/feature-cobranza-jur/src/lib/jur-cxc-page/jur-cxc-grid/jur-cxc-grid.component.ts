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
  CuentaPorCobrarDTO,
  formatFormaDePago,
  formatTipoDocto,
  formatUUID,
} from '@nx-papelsa/shared/utils/core-models';

import { AgPrinterRendererComponent } from '@nx-papelsa/shared/utils/ui-common';

@Component({
  selector: 'nx-papelsa-jur-cxc-grid',
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
      >
      </ag-grid-angular>
    </div>
  `,
  styles: [
    `
      .grid-container {
        display: flex;
        flex-direction: column;
        height: 100%;

        .grid {
          flex: 1 1 auto;
          width: 100%;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JurCxcGridComponent implements OnInit {
  @Input() rows: CuentaPorCobrarDTO[];
  @Input() columnDefs = this.buildColumnDef();
  @Input() searchTerm: string;

  @Output() selectionChange = new EventEmitter<CuentaPorCobrarDTO[]>();
  @Output() drillDown = new EventEmitter<CuentaPorCobrarDTO>();
  @Output() print = new EventEmitter<CuentaPorCobrarDTO>();
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  gridOptions: GridOptions;
  defaultColDef;

  constructor(@Inject(LOCALE_ID) private locale: string) {}

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

    this.gridOptions.rowHeight = 35;
    this.gridOptions.headerHeight = 40;
    this.gridOptions.suppressCellSelection = true;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onModelUpdated(event) {
    //console.log('Model updated', this.rows);
    if (this.gridApi) {
      this.gridColumnApi.autoSizeAllColumns();
      this.gridApi.resetRowHeights();
    }
  }

  onChangeSelection(event) {
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    this.selectionChange.emit(selectedData);
  }

  buildRowStyle(params: any) {
    if (params.node.rowPinned) {
      return { 'font-weight': 'bold' };
    }
    // if (!params.data.cfdi && params.data.tipo !== 'CHE') {
    //   return {
    //     'font-weight': 'bold',
    //     'font-style': 'italic',
    //     color: 'rgb(190, 26, 26)',
    //   };
    // }
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
        headerName: 'Nombre',
        field: 'nombre',
        width: 205,
        checkboxSelection: true,
        headerCheckboxSelection: true,
      },
      {
        headerName: 'Tipo',
        field: 'tipoDocumento',
        width: 90,
        valueGetter: (params) => params.data.cxc.tipo,
        valueFormatter: (params) => formatTipoDocto(params.value),
      },
      {
        headerName: 'Docto',
        field: 'documento',
        maxWidth: 110,
        valueGetter: (params) => params.data.cxc.documento,
      },

      {
        headerName: 'Fecha',
        field: 'fecha',
        width: 120,
        valueGetter: (params) => params.data.cxc.fecha,
        valueFormatter: (params) => this.formatDate(params.value),
      },
      {
        headerName: 'Traspaso',
        field: 'traspaso',
        width: 120,
        valueFormatter: (params) => this.formatDate(params.value),
      },

      {
        headerName: 'Total',
        field: 'total',
        width: 120,
        valueGetter: (params) => params.data.cxc.total,
        valueFormatter: (params) => this.formatCurrency(params.value),
      },
      {
        headerName: 'Pagos',
        field: 'pagos',
        width: 115,
        valueGetter: (params) => params.data.cxc.total,
        valueFormatter: (params) => this.formatCurrency(params.value),
      },
      {
        headerName: 'Saldo',
        field: 'saldo',
        width: 120,
        valueGetter: (params) => params.data.cxc.saldoReal,
        valueFormatter: (params) => this.formatCurrency(params.value),
      },
      {
        headerName: 'Vto',
        field: 'vencimiento',
        width: 120,
        valueGetter: (params) => params.data.cxc.vencimiento,
        valueFormatter: (params) => this.formatDate(params.value),
      },
      {
        headerName: 'Atraso',
        field: 'atraso',
        width: 100,
        valueGetter: (params) =>
          params.data.saldo <= 0.0 ? 0 : params.data.cxc.atraso,
        cellClass: (params) => (params.value > 5 ? 'warn-cell' : ''),
      },
      {
        headerName: 'Comentario',
        field: 'comentario',
        minWidth: 200,
      },
      // {
      //   headerName: 'P',
      //   colId: 'print',
      //   width: 50,
      //   cellRendererFramework: AgPrinterRendererComponent,
      //   resizable: false,
      //   sortable: false,
      //   filter: false,
      // },
    ];
  }
}

/**
 * abogado: "FRANCISCO FRIAS 2000 PLUS S,A .D E C.V."
asignacion: "2018-12-03T06:00:00Z"
cxc: {id: "8a8a818964c7d8b60164c810ae37000e", total: 11148.01, tipoDocumento: "VENTA", formaDePago: "EFECTIVO", uuid: "2AB997E4-92DD-4BC0-93C4-69E34A50F204", …}
dateCreated: "2018-12-03T06:00:00Z"
despacho: {id: "8a8a816563b6f9da0163c106bfc20d02", abogados: Array(0), dateCreated: "2018-06-02T20:03:55Z", activo: true, lastUpdated: "2020-01-16T18:02:31Z", …}
id: "1b997146-f72f-11e8-b27f-5065f368f0c2"
importe: 11148.01
lastUpdated: "2018-12-03T06:00:00Z"
nombre: "IMPRENTA AJUSCO, S.A. DE C.V."
saldo: 11148.01
traspaso: "2015-09-28T05:00:00Z"
 */
