import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import { GridApi, ColumnApi, ColDef, GridOptions } from 'ag-grid-community';

import { Cliente } from '@nx-papelsa/shared/utils/core-models';

import {
  FormatService,
  AgBooleanRendererComponent,
} from '@nx-papelsa/shared/utils/ui-common';

@Component({
  selector: 'nx-papelsa-clientes-grid',
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
        rowSelection="rowSelection"
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
export class ClientesGridComponent implements OnInit {
  @Input() rows: Cliente[];
  @Input() columnDefs = this.buildColumnDef();
  @Input() searchTerm: string;
  @Input() rowSelection: 'multiple' | 'single' = 'single';

  @Output() selectionChange = new EventEmitter<Cliente[]>();
  @Output() drillDown = new EventEmitter<Cliente>();
  @Output() print = new EventEmitter<Cliente>();
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  gridOptions: GridOptions;
  defaultColDef;

  constructor(private format: FormatService) {}

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
      // if (event.colDef.colId === 'print') {
      //   event.api.deselectAll();
      //   this.print.emit(event.data);
      // }
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
  }

  clearSelection() {
    this.gridApi.deselectAll();
  }

  private buildColumnDef(): ColDef[] {
    return [
      {
        headerName: 'Clave',
        field: 'calave',
        maxWidth: 130,
        checkboxSelection: true,
        headerCheckboxSelection: true,
      },
      {
        headerName: 'Nombre',
        field: 'nombre',
        width: 350,
      },
      {
        headerName: 'Crédito',
        colId: 'credito',
        valueGetter: (params) => (params.data.credito ? true : false),
        cellRendererFramework: AgBooleanRendererComponent,
        width: 90,
      },
    ];
  }
}
