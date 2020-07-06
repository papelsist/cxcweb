import { Component, OnInit } from '@angular/core';
import { CuentaPorCobrarDTO } from './cartera-dto';

import { sumByProperty } from '@nx-papelsa/shared/utils/collections';

@Component({
  selector: 'papx-cxc-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  rows: CuentaPorCobrarDTO[] = [];

  constructor() {}

  ngOnInit(): void {
    fetch('assets/cartera.json').then((response) => {
      response.json().then((data) => {
        this.rows = data;
        const map = this.rows.reduce((r, a) => {
          r[a.nombre] = [...(r[a.nombre] || []), a];
          return r;
        }, {});

        // console.log('Map:', map);
        const clientes = Object.keys(map);
        // console.log('Clientes:', clientes);
        const infoData = clientes.map((item) => {
          return {
            item,
            facturas: map[item],
            total: sumByProperty(map[item], 'total'),
          };
        });
        console.log('InfoData: ', infoData);
      });
    });
  }
}
