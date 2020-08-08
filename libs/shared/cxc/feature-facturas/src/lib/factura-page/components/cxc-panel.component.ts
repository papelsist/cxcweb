import { Component, OnInit, Input } from '@angular/core';
import {
  PropertyItem,
  CuentaPorCobrar,
} from '@nx-papelsa/shared/utils/core-models';

import { FormatService } from '@nx-papelsa/shared/utils/ui-common';

@Component({
  selector: 'nx-papelsa-cxc-cxcpanel',
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ cxc.nombre }}</mat-card-title>
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
export class CXCPanelComponent implements OnInit {
  @Input() cxc: Partial<CuentaPorCobrar>;

  @Input() properties: PropertyItem[] = [
    { key: 'tipo', type: 'string' },
    { key: 'tipoDocumento', type: 'string' },
    { key: 'documento', type: 'string' },
    { key: 'sucursal', type: 'string' },
    { key: 'fecha', type: 'date' },
    { key: 'vencimiento', type: 'date' },
    { key: 'atrasoCalculado', type: 'number', label: 'Atraso' },
    { key: 'formaDePago', type: 'string', label: 'F.Pago' },
    { key: 'comentario', type: 'string' },
    { key: 'createUser', type: 'string', label: 'Creado por' },
  ];

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
