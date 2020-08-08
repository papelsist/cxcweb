import { Component, OnInit, Input } from '@angular/core';
import {
  PropertyItem,
  CuentaPorCobrar,
  VentaCredito,
} from '@nx-papelsa/shared/utils/core-models';

import { FormatService } from '@nx-papelsa/shared/utils/ui-common';

@Component({
  selector: 'nx-papelsa-cxc-credito-panel',
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Crédito</mat-card-title>
      </mat-card-header>

      <mat-divider></mat-divider>

      <mat-list>
        <mat-list-item *ngFor="let item of properties; last as last">
          <span class="pad-right"
            >{{ item.label || capitalize(item.key) }}:</span
          >
          <strong
            class="pull-right"
            [ngClass]="item.className"
            *ngIf="item.type !== 'boolean'; else booleanPanel"
          >
            {{ getValue(item) }}
          </strong>
          <ng-template #booleanPanel>
            <mat-icon *ngIf="getValue(item)" class="pull-right"
              >checked</mat-icon
            >
          </ng-template>
          <mat-divider *ngIf="!last"></mat-divider>
        </mat-list-item>
      </mat-list>
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
export class CreditoPanelComponent implements OnInit {
  @Input() credito: Partial<VentaCredito>;

  @Input() properties: PropertyItem[] = [
    { key: 'plazo', type: 'number' },
    { key: 'vencimientoFactura', type: 'boolean' },
    { key: 'revision', type: 'boolean' },
    { key: 'diaRevision', type: 'number' },
    { key: 'diaPago', type: 'number' },
    { key: 'fechaPago', type: 'date', label: 'Pago' },
    { key: 'reprogramarPago', type: 'date', label: 'Reprogramar' },
    { key: 'revisada', type: 'boolean' },
    { key: 'fechaRevision', type: 'date' },
    { key: 'fechaRevisionCxc', type: 'date' },
    { key: 'operador', type: 'string' },
    { key: 'cobrador', type: 'string' },
  ];

  constructor(private service: FormatService) {}

  ngOnInit() {}

  capitalize(s: string) {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  getValue(item: PropertyItem) {
    const value = this.credito[item.key];
    if (item.key === 'cobrador') {
      try {
        return value['nombres'];
      } catch (error) {
        return 'ND';
      }
    }
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
