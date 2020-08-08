import { Component, OnInit, Input } from '@angular/core';
import { PropertyItem, Venta } from '@nx-papelsa/shared/utils/core-models';

import { FormatService } from '@nx-papelsa/shared/utils/ui-common';
import { ITdDataTableColumn } from '@covalent/core/data-table';

@Component({
  selector: 'nx-papelsa-cxc-ventapanel',
  template: `
    <!--
    <mat-card>
      <mat-card-header>
        <mat-card-title>Venta</mat-card-title>
      </mat-card-header>
      <mat-divider></mat-divider>

      <div class="main-panel">
        <div>
          <td-data-table [data]="venta.partidas" [columns]="columns">
          </td-data-table>
        </div>

        <div>
          <mat-list>
            <mat-list-item *ngFor="let item of properties; last as last">
              <span class="pad-right"
                >{{ item.label || capitalize(item.key) }}:</span
              >
              <strong class="pull-right" [ngClass]="item.className">
                {{ getValue(item) }}
              </strong>
              <mat-divider *ngIf="!last"></mat-divider>
            </mat-list-item>
          </mat-list>
        </div>
      </div>
    </mat-card>
  -->

    <div>
      <mat-drawer-container>
        <mat-drawer
          [opened]="false"
          position="end"
          mode="over"
          #sidesheet
          class="slide-panel"
        >
          <td-sidesheet>
            <td-sidesheet-header>
              <td-sidesheet-title>Importes</td-sidesheet-title>
              <button mat-icon-button td-sidesheet-header-action>
                <mat-icon
                  matTooltipPosition="before"
                  matTooltip="Cerrar"
                  (click)="sidesheet.toggle()"
                  >close</mat-icon
                >
              </button>
            </td-sidesheet-header>

            <td-sidesheet-content>
              <mat-list>
                <mat-list-item *ngFor="let item of properties; last as last">
                  <span class="pad-right"
                    >{{ item.label || capitalize(item.key) }}:</span
                  >
                  <strong class="pull-right" [ngClass]="item.className">
                    {{ getValue(item) }}
                  </strong>
                </mat-list-item>
              </mat-list>
            </td-sidesheet-content>
          </td-sidesheet>
        </mat-drawer>
        <mat-card>
          <mat-toolbar color="accent">
            Venta (Productos)
            <span fxFlex></span>
            <button mat-icon-button (click)="sidesheet.toggle()">
              <mat-icon>more_vert</mat-icon>
            </button>
          </mat-toolbar>
          <td-data-table [data]="venta.partidas" [columns]="columns">
          </td-data-table>
        </mat-card>
      </mat-drawer-container>
    </div>
  `,
  styles: [
    `
      .mat-card {
        padding: 0px 0px;
        margin: 5px 0px;
      }
      .mat-toolbar {
        height: 50px;
        font-size: 1rem;
      }

      .slide-panel {
        padding: 5px 10px;
        width: 300px;
      }
    `,
  ],
})
export class VentaPanelComponent implements OnInit {
  @Input() venta: Partial<Venta>;

  @Input() properties: PropertyItem[] = [
    { key: 'importe', type: 'currency' },
    { key: 'descuentoImporte', type: 'currency', label: 'Descuento' },
    { key: 'subtotal', type: 'currency' },
    { key: 'impuesto', type: 'currency' },
    { key: 'total', type: 'currency' },
    { key: 'moneda', type: 'string' },
  ];

  @Input() columns: ITdDataTableColumn[] = [
    { name: 'clave', label: 'Producto' },
    { name: 'descripcion', label: 'Descripción', width: 300 },
    {
      name: 'precio',
      label: 'Precio',
      format: (v) => this.service.formatCurrency(v),
    },
    { name: 'cantidad', label: 'Cantidad' },
    {
      name: 'importe',
      label: 'Precio',
      format: (v) => this.service.formatCurrency(v),
    },
    {
      name: 'descuentoImporte',
      label: 'Descuento',
      format: (v) => this.service.formatCurrency(v),
    },
    {
      name: 'subtotal',
      label: 'Sub Total',
      format: (v) => this.service.formatCurrency(v),
    },
    {
      name: 'impuesto',
      label: 'Impuesto',
      format: (v) => this.service.formatCurrency(v),
    },
    {
      name: 'total',
      label: 'Total',
      format: (v) => this.service.formatCurrency(v),
    },
  ];

  constructor(private service: FormatService) {}

  ngOnInit() {}

  capitalize(s: string) {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  getValue(item: PropertyItem) {
    const value = this.venta[item.key];
    switch (item.type) {
      case 'date':
        return this.service.formatDate(value);
      case 'currency':
        return this.service.formatCurrency(value);
      default:
        return value;
    }
  }
}
