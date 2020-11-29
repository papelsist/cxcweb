import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  PropertyItem,
  CuentaPorCobrar,
} from '@nx-papelsa/shared/utils/core-models';

import { FormatService } from '@nx-papelsa/shared/utils/ui-common';

@Component({
  selector: 'nx-papelsa-cxc-totalespanel',
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Cuenta por pagar</mat-card-title>
      </mat-card-header>

      <mat-divider></mat-divider>

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
      <mat-divider></mat-divider>
      <mat-card-actions>
        <button
          mat-button
          color="warn"
          [disabled]="cxc.juridico || cxc.saldoReal <= 0.0"
          (click)="juridico.emit(cxc)"
        >
          <mat-icon>account_balance</mat-icon>
          <span>Mandar a jurídico</span>
        </button>

        <button
          mat-button
          color="accent"
          [disabled]="cxc.saldoReal <= 0.0"
          (click)="pagare.emit(cxc)"
        >
          <mat-icon>account_balance_wallet</mat-icon>
          <span>Imprimir pagare</span>
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [
    `
      .mat-card {
        padding: 10px 0px;
      }
      .mat-list-item {
        height: 2rem;
      }
      .uuid {
        font-size: 12px;
      }
    `,
  ],
})
export class TotalesPanelComponent implements OnInit {
  @Input() cxc: Partial<CuentaPorCobrar>;

  @Input() properties: PropertyItem[] = [
    { key: 'importe', type: 'currency' },
    { key: 'descuentoImporte', type: 'currency' },
    { key: 'subtotal', type: 'currency' },
    { key: 'impuesto', type: 'currency' },
    { key: 'total', type: 'currency' },
    { key: 'pagos', type: 'currency' },
    {
      key: 'saldoReal',
      type: 'currency',
      label: 'Saldo',
      className: 'warn-cell',
    },
    { key: 'moneda', type: 'string' },
  ];
  @Output() juridico = new EventEmitter<Partial<CuentaPorCobrar>>();
  @Output() pagare = new EventEmitter<Partial<CuentaPorCobrar>>();

  constructor(private service: FormatService) {}

  ngOnInit() {}

  capitalize(s: string) {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  getValue(item: PropertyItem) {
    const value = this.cxc[item.key];
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
