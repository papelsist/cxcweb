import { Component, OnInit } from '@angular/core';
import { CuentaPorCobrarDTO } from './cartera-dto';

import {
  groupByProperty,
  sumByProperty,
} from '@nx-papelsa/shared/utils/collections';

@Component({
  selector: 'papx-cxc-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  rows: any[] = [];

  constructor() {}

  ngOnInit(): void {
    fetch('assets/cartera.json').then((response) => {
      response.json().then((data) => {
        this.rows = data;
        const map = groupByProperty(data, 'nombre');
        const clientes = Object.keys(map);
        this.rows = clientes.map((item, row: any) => {
          return {
            item,
            facturas: map[item],
            total: sumByProperty(row[item], 'total'),
          };
        });
        console.log('InfoData: ', this.rows);
      });
    });
  }
}
