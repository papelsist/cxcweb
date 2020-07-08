import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import {
  sumByProperty,
  MonedaUtils,
} from '@nx-papelsa/shared/utils/collections';

@Component({
  selector: 'papx-cxc-cartera-grid',
  templateUrl: './cartera-grid.component.html',
  styleUrls: ['./cartera-grid.component.scss'],
})
export class CarteraGridComponent implements OnInit {
  private _data: any[] = [];
  @Input() displayColumns = ['nombre', 'saldo', 'part'];

  dataSource = new MatTableDataSource(this._data);
  saldoTotal = 0;

  constructor() {}

  ngOnInit(): void {}

  filter(value: string) {
    this.dataSource.filter = value;
  }

  @Input() set data(rows: any[]) {
    this._data = rows;
    this.dataSource = new MatTableDataSource(this._data);
    this.saldoTotal = sumByProperty(this.dataSource.data, 'saldo');
  }

  // getSaldoTotal() {
  //   return sumByProperty(this.dataSource.data, 'saldo');
  // }

  getParticipacion(saldo: number) {
    return MonedaUtils.round(saldo / this.saldoTotal, 2);
  }
}
