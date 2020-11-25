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

import { Cobro, formatFormaDePago } from '@nx-papelsa/shared/utils/core-models';
import { AgBooleanRendererComponent } from '@nx-papelsa/shared/utils/ui-common';

@Component({
  selector: 'nx-papelsa-cobros-grid',
  template: `
    <div class="cargos-grid-container">
      <ag-grid-angular
        #agGrid
        class="ag-theme-alpine grid"
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
        [defaultColDef]="defaultColDef"
      >
      </ag-grid-angular>
    </div>
  `,
  styles: [
    `
      .cargos-grid-container {
        display: flex;
        height: 100%;
        width: 100%;

        .grid {
          height: calc(100% - 1px);
          width: calc(100% - 1px);
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CobrosGridComponent implements OnInit {
  @Input() rows: Cobro[];
  @Input() columnDefs = this.buildColumnDef();
  @Input() searchTerm: string;

  @Output() selectionChange = new EventEmitter<Cobro[]>();
  @Output() drillDown = new EventEmitter<Cobro>();
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
      width: 150,
      sortable: true,
      resizable: true,
    };
    this.gridOptions.getRowStyle = this.buildRowStyle.bind(this);
    this.gridOptions.onRowDoubleClicked = (event) => {
      this.drillDown.emit(event.data);
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
    if (this.gridApi) {
      // this.gridColumnApi.autoSizeAllColumns();
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
    if (params.data.cierre) {
      return { 'font-weight': 'bold', 'font-style': 'italic', color: 'green' };
    }
    if (params.data.requiereRecibo && !params.data.cfdi) {
      return {
        'font-weight': 'bold',
        'font-style': 'italic',
        color: 'rgb(190, 119, 26)',
      };
    }
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

  clearSelection() {
    this.gridApi.deselectAll();
  }

  private buildColumnDef(): ColDef[] {
    return [
      {
        headerName: 'Fecha',
        field: 'fecha',
        sortable: true,
        headerCheckboxSelection: true,
        checkboxSelection: true,
        width: 130,
        valueFormatter: (params) => this.formatDate(params.value),
      },
      {
        headerName: 'T',
        field: 'tipo',
        width: 80,
        sortable: true,
        filter: true,
      },
      {
        headerName: 'F.P.',
        field: 'formaDePago',
        width: 110,
        valueFormatter: (params) => formatFormaDePago(params.value),
        sortable: true,
        filter: true,
      },
      {
        headerName: 'Nombre',
        field: 'nombre',
        sortable: true,
        filter: true,
        resizable: true,
        minWidth: 250,
      },
      {
        headerName: 'Sucursal',
        field: 'sucursalNombre',
        maxWidth: 110,
        sortable: true,
        filter: true,
      },

      {
        headerName: 'Mon',
        field: 'moneda',
        width: 70,
      },
      {
        headerName: 'Importe',
        field: 'importe',
        sortable: true,
        filter: true,
        width: 120,
        valueFormatter: (params) => this.formatCurrency(params.value),
      },
      {
        headerName: 'Aplicado',
        field: 'aplicado',
        sortable: true,
        filter: true,
        width: 120,
        valueFormatter: (params) => this.formatCurrency(params.value),
      },
      {
        headerName: 'Disponible',
        field: 'saldo',
        sortable: true,
        filter: true,
        width: 120,
        valueFormatter: (params) => this.formatCurrency(params.value),
      },
      {
        headerName: 'CFDI',
        field: 'cfdi',
        cellRendererFramework: AgBooleanRendererComponent,
        width: 90,
      },
      {
        headerName: 'Comentario',
        field: 'comentario',
      },
    ];
  }
}
