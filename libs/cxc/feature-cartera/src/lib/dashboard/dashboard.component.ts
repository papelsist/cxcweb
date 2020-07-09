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
        const map: any = groupByProperty(data, 'nombre');
        const clientes = Object.keys(map);
        this.rows = clientes
          .map((item, row: any) => {
            return {
              nombre: item,
              facturas: map[item],
              saldo: sumByProperty(map[item], 'saldo'),
            };
          })
          .sort((a, b) => {
            if (a.saldo > b.saldo) return -1;
            if (a.saldo < b.saldo) return 1;
            else return 0;
          });
      });
    });
  }

  onSelection(selected: any) {
    console.log('Selected: ', selected);
  }
}
