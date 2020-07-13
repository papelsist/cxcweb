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

import { DevolucionDto } from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'nx-papelsa-devoluciones-grid',
  templateUrl: './devoluciones-grid.component.html',
  styleUrls: ['./devoluciones-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevolucionesGridComponent implements OnInit {
  @Input() rows: DevolucionDto[];
  @Input() columnDefs = this.buildColumnDef();
  @Output() selectionChange = new EventEmitter<DevolucionDto[]>();
  @Output() drillDown = new EventEmitter<DevolucionDto>();
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
    // this.gridOptions.columnDefs = this.buildColsDef();
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
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  onModelUpdated(event) {
    if (this.gridApi) {
      this.gridColumnApi.autoSizeAllColumns();
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
    if (params.data.status === 'CERRADO') {
      return { 'font-weight': 'bold', 'font-style': 'italic', color: 'green' };
    }
    if (!params.data.cfdi) {
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

  private buildColumnDef(): ColDef[] {
    return [
      {
        headerName: 'RMD',
        field: 'documento',
        sortable: true,
        filter: true,
        checkboxSelection: true,
        width: 100,
      },
      {
        headerName: 'Factura',
        field: 'factura',
        sortable: true,
        filter: true,
        width: 140,
      },
      {
        headerName: 'Fecha',
        field: 'fecha',
        sortable: true,
        width: 110,
        valueFormatter: (params) => this.formatDate(params.value),
      },
      {
        headerName: 'Sucursal',
        field: 'sucursal',
        sortable: true,
        filter: true,
        width: 110,
      },
      {
        headerName: 'Nombre',
        field: 'nombre',
        sortable: true,
        filter: true,
      },

      {
        headerName: 'Total',
        field: 'total',
        sortable: true,
        valueFormatter: (params) => this.formatCurrency(params.value),
      },
      {
        headerName: 'Nota',
        field: 'nota',
        valueFormatter: (params) =>
          params.value ? `${params.value.serie} - ${params.value.folio}` : '',
      },
      {
        headerName: 'CFDI',
        field: 'cfdi',
        valueFormatter: (params) =>
          params.value ? params.value.substr(-6, 6) : 'PENDIENTE',
      },
    ];
  }
}
