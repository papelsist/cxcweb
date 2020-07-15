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

import { NotaDeCargoDto } from '@nx-papelsa/shared/utils/core-models';

import { BooleanRendererComponent } from './boolean-renderer.component';

@Component({
  selector: 'nx-papelsa-cxc-cargos-grid',
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
export class CargosGridComponent implements OnInit {
  @Input() rows: NotaDeCargoDto[];
  @Input() columnDefs = this.buildColumnDef();
  @Output() selectionChange = new EventEmitter<NotaDeCargoDto[]>();
  @Output() drillDown = new EventEmitter<NotaDeCargoDto>();
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
        headerName: 'Tipo',
        field: 'tipo',
        width: 90,
      },
      {
        headerName: 'Folio',
        field: 'folio',
        sortable: true,
        filter: true,
        width: 100,
      },
      {
        headerName: 'Fecha',
        field: 'fecha',
        sortable: true,
        width: 110,
        valueFormatter: (params) => this.formatDate(params.value),
      },
      {
        headerName: 'Nombre',
        field: 'nombre',
        sortable: true,
        filter: true,
      },
      {
        headerName: 'Comentario',
        field: 'comentario',
        sortable: true,
        filter: true,
      },
      {
        headerName: 'Mon',
        field: 'moneda',
        maxWidth: 90,
      },
      {
        headerName: 'Total',
        field: 'total',
        sortable: true,
        filter: true,
        valueFormatter: (params) => this.formatCurrency(params.value),
      },
      {
        headerName: 'CFDI',
        field: 'cfdi',
        cellRendererFramework: BooleanRendererComponent,
        // filter: true,
        // valueFormatter: (params) =>
        //   params.value ? params.value.id.substr(-6, 6) : 'PENDIENTE',
      },
    ];
  }
}
