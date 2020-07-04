import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { CuentaPorCobrarDTO } from './cartera-dto';

import { GridApi, ColumnApi } from 'ag-grid-community';

@Component({
  selector: 'nx-papelsa-cartera-cre',
  templateUrl: './cartera-cre.component.html',
  styleUrls: ['./cartera-cre.component.scss'],
})
export class CarteraCreComponent implements OnInit {
  cartera: CuentaPorCobrarDTO[] = [];
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

  ngOnInit(): void {
    fetch('assets/cartera.json').then((response) => {
      response.json().then((data) => (this.cartera = data));
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onChangeSelection() {
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    this.selectionChange.emit(selectedData);
  }
}
