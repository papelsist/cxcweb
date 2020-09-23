import { Component, Input, OnInit } from '@angular/core';
import { VentaCommand, VentaMensual } from '../ventas-models';

@Component({
  selector: 'papx-cxc-vtas-bar-char',
  template: `
    <td-chart [style.height.px]="300">
      <td-chart-dataset
        [source]="chartData"
        [sourceHeader]="true"
      ></td-chart-dataset>

      <td-chart-tooltip [trigger]="'item'"> </td-chart-tooltip>
      <td-chart-x-axis
        [show]="true"
        [position]="'bottom'"
        [type]="'category'"
        [boundaryGap]="true"
        [axisLabel]="{ inteval: 0, rotate: '45' }"
      ></td-chart-x-axis>
      <td-chart-y-axis
        [show]="true"
        [type]="'value'"
        [position]="'right'"
        [splitLine]="{ lineStyle: { type: 'dotted' } }"
      ></td-chart-y-axis>
      <td-chart-series td-bar [name]="'Venta'"></td-chart-series>
      <td-chart-series td-bar [name]="'Utilidad'"></td-chart-series>
    </td-chart>
  `,
  styles: [
    `
      .bar-chart {
        height: 400px;
      }
    `,
  ],
})
export class VtaMensualBarChartComponent implements OnInit {
  @Input() command: VentaCommand;
  _data: VentaMensual[] = [];
  chartData: any[];
  config: any = {
    xAxis: [
      {
        axisLabel: {
          interval: 0,
        },
      },
    ],
  };
  constructor() {}

  ngOnInit() {}

  @Input() set data(value: VentaMensual[]) {
    this._data = value;
    this.buildBarData();
  }
  get data() {
    return this._data;
  }

  buildBarData() {
    let referencia = 0.05;
    if (this.command) {
      if (this.command.slice.toLowerCase() === 'sucursal') {
        referencia = 0.01;
      }
    }

    this.chartData = this._data
      .filter((item) => item.participacion > 0.01)
      .map((item) => [
        item.descripcion === 'CALLE 4' ? 'CALLE4' : item.descripcion,
        item.ventaNeta,
        item.importeUtilidad,
      ]);
    if (this.command && this.command.slice.toLowerCase() === 'cliente') {
      if (this.chartData.length > 10) {
        this.chartData = this.chartData.slice(0, 9);
      }
    }
  }
}
