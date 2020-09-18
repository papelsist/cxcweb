import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

import { CuentaPorCobrarDTO } from '../cartera-dto';

import { GridApi, ColumnApi } from 'ag-grid-community';

@Component({
  selector: 'papx-cxc-clientes-grid',
  templateUrl: './clientes-grid.component.html',
  styleUrls: ['./clientes-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientesGridComponent implements OnInit {
  @Input() rows: CuentaPorCobrarDTO[] = [];
  @Output() selectionChange = new EventEmitter<CuentaPorCobrarDTO[]>();
  gridApi: GridApi;
  gridColumnApi: ColumnApi;

  columnDefs = [
    {
      headerName: 'Nombre',
      field: 'nombre',
      sortable: true,
      filter: true,
      checkboxSelection: true,
    },
    { headerName: 'Sucursal', field: 'sucursal', sortable: true, filter: true },
    { headerName: 'Total', field: 'total', sortable: true },
  ];
  constructor() {}

  ngOnInit(): void {}

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onChangeSelection(event) {
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    this.selectionChange.emit(selectedData);
  }
}
