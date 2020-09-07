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

import { VentaCredito } from '@nx-papelsa/shared/utils/core-models';
import {
  AgBooleanRendererComponent,
  FormatService,
  AgGridText,
  agDateComparator,
} from '@nx-papelsa/shared/utils/ui-common';
import * as moment from 'moment';

@Component({
  selector: 'nx-papelsa-cxc-revision-grid',
  template: `
    <div class="cargos-grid-container">
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
    </div>
  `,
  styleUrls: ['./revisiones-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RevisionesGridComponent implements OnInit {
  private _rows: VentaCredito[];
  @Input() columnDefs = this.buildColumnDef();
  @Input() searchTerm: string;
  @Input() selectedRows = [];
  @Output() selectionChange = new EventEmitter<VentaCredito[]>();
  @Output() drillDown = new EventEmitter<VentaCredito>();
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  gridOptions: GridOptions;
  defaultColDef;
  rowClassRules;
  pinnedBottomRowData;

  constructor(private formatService: FormatService) {
    this.rowClassRules = {
      'warning-row': ({ data: { atraso } }) => atraso > 0 && atraso < 7,
      'danger-row': ({ data: { atraso } }) => atraso >= 7,
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
    this.gridOptions.getRowNodeId = (data) => data.id;
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
    let registros = 0;
    let totalSuma = 0.0;
    let saldoSuma = 0.0;
    if (this.gridApi) {
      this.gridApi.forEachNodeAfterFilter(
        ({ data: { total, saldo } }, index) => {
          totalSuma += total;
          saldoSuma += saldo;
          registros++;
        }
      );
    }
    const res = [
      {
        nombre: `Facturas: ${registros}`,
        total: totalSuma,
        saldo: saldoSuma,
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

  /*
  @Input()
  set selectedRows(value: string[]) {
    this.
    console.log('Appling selection ', value);
    value.forEach((row) => {
      console.log('Selecting: ', row);
      const node = this.gridApi.getRowNode(row);
      console.log('Node: ', node.data);
      if (!node.isSelected()) {
        node.selectThisNode(true);
        console.log('Is node selected:', node.isSelected);
      }

      // this.gridApi.getRowNode(row).selectThisNode(true);
    });
  }
  */

  private buildColumnDef(): ColDef[] {
    return [
      {
        headerName: '#',
        width: 100,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        valueGetter: (params) => params.node.rowIndex + 1,
        pinned: 'left',
        pinnedRowCellRenderer: (params) => '',
      },
      {
        headerName: 'Nombre',
        field: 'nombre',
        minWidth: 250,
        // cellClass: (params) => 'small-cell',
        pinned: 'left',
      },
      {
        headerName: 'Cob',
        field: 'cobrador',
        width: 90,
        headerTooltip: 'Cobrador',
        pinned: 'left',

        // valueFormatter: (params) => params.value.sw2,
        valueGetter: ({ data: { cobrador } }) =>
          cobrador ? cobrador.sw2 : null,
      },
      {
        headerName: 'Suc',
        headerTooltip: 'Sucursal',
        field: 'sucursal',
        width: 100,
      },
      {
        headerName: 'Docto',
        field: 'documento',
        width: 100,
      },

      {
        headerName: 'Fecha',
        field: 'fecha',
        width: 110,
        valueFormatter: (params) => this.formatDate(params.value),
      },
      {
        headerName: 'Recibida',
        field: 'fechaRecepcionCxc',
        width: 120,
        valueFormatter: (params) => this.formatDate(params.value),
        filter: 'agDateColumnFilter',
        filterParams: {
          filterOptions: [
            'equals',
            'lessThan',
            'lessThanOrEqual',
            'greaterThan',
            'greaterThanOrEqual',
          ],
          buttons: ['apply', 'clear', 'cancel'],
          inRangeInclusive: true,
          comparator: agDateComparator,
        },
      },
      {
        headerName: 'Revisada',
        field: 'revisada',
        cellRendererFramework: AgBooleanRendererComponent,
        width: 100,
        filter: false,
      },
      {
        headerName: 'Revisión',
        field: 'revision',
        cellRendererFramework: AgBooleanRendererComponent,
        width: 100,
        filter: false,
      },
      {
        headerName: 'Vto',
        field: 'vencimiento',
        width: 110,
        valueFormatter: (params) => this.formatDate(params.value),
      },
      {
        headerName: 'F. Rev',
        field: 'fechaRevision',
        width: 110,
        valueFormatter: (params) => this.formatDate(params.value),
        filter: 'agDateColumnFilter',
        filterParams: {
          filterOptions: [
            'equals',
            'lessThan',
            'lessThanOrEqual',
            'greaterThan',
            'greaterThanOrEqual',
          ],
          buttons: ['apply', 'clear', 'cancel'],
          inRangeInclusive: true,
          comparator: agDateComparator,
        },
      },

      {
        headerName: 'RPago',
        field: 'reprogramarPago',
        headerTooltip: 'Reprogramación de pago',
        width: 110,
        valueFormatter: (params) => this.formatDate(params.value),
        filter: 'agDateColumnFilter',
        filterParams: {
          filterOptions: [
            'equals',
            'lessThan',
            'lessThanOrEqual',
            'greaterThan',
            'greaterThanOrEqual',
          ],
          buttons: ['apply', 'clear', 'cancel'],
          inRangeInclusive: true,
          comparator: agDateComparator,
        },
      },
      {
        headerName: 'Total',
        field: 'total',
        width: 130,
        valueFormatter: (params) => this.formatCurrency(params.value),
      },
      {
        headerName: 'Saldo',
        field: 'saldo',
        width: 130,
        valueFormatter: (params) => this.formatCurrency(params.value),
      },
      {
        headerName: 'Atraso',
        field: 'atraso',
        width: 110,
      },
      {
        headerName: 'Actualizado',
        field: 'lastUpdated',
        width: 130,
        valueFormatter: (params) =>
          this.formatService.formatDate(params.value, 'dd/MM/yyyy HH:mm'),
      },
      {
        headerName: 'Usuario',
        field: 'updateUser',
        width: 130,
      },
      {
        headerName: 'Comentario',
        field: 'comentario',
        width: 130,
      },
      {
        headerName: 'Comentario Rep',
        field: 'comentarioReprogramarPago',
        width: 130,
      },
    ];
  }
}
