import { Component, OnInit, Input } from '@angular/core';
import {
  Cfdi,
  Cliente,
  PropertyItem,
} from '@nx-papelsa/shared/utils/core-models';

import { FormatService } from '@nx-papelsa/shared/utils/ui-common';

@Component({
  selector: 'nx-papelsa-cxc-cfdipanel',
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>CFDI </mat-card-title>
        <mat-card-subtitle> </mat-card-subtitle>
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
        <nx-papelsa-cfdi-pdf [cfdi]="cfdi"></nx-papelsa-cfdi-pdf>
        <nx-papelsa-cfdi-email
          [cfdi]="cfdi"
          [target]="cliente.cfdiMail"
          [nombre]="cliente.nombre"
        ></nx-papelsa-cfdi-email>
        <nx-papelsa-cfdi-xml [cfdi]="cfdi"></nx-papelsa-cfdi-xml>
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
export class CfdiPanelComponent implements OnInit {
  @Input() cfdi: Partial<Cfdi>;
  @Input() cliente: Partial<Cliente>;

  @Input() properties: PropertyItem[] = [
    { key: 'serie', type: 'string' },
    { key: 'folio', type: 'string' },
    { key: 'fecha', type: 'date' },
    { key: 'uuid', type: 'string', label: 'UUID', className: 'uuid' },
    { key: 'tipoDeComprobante', type: 'string', label: 'Tipo de comprobante' },
    { key: 'enviado', type: 'date' },
    { key: 'email', type: 'string' },
    { key: 'comentario', type: 'string' },
    { key: 'fileName', type: 'string', label: 'Archivo' },
    { key: 'createUser', type: 'string', label: 'Creado por' },
  ];

  constructor(private service: FormatService) {}

  ngOnInit() {
    console.log('Cliente: ', this.cliente);
  }

  capitalize(s: string) {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  getValue(item: PropertyItem) {
    const value = this.cfdi[item.key];
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
