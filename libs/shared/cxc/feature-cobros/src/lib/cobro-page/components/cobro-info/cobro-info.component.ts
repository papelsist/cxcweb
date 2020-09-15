import { Component, OnInit, Input } from '@angular/core';
import { PropertyItem, Cobro } from '@nx-papelsa/shared/utils/core-models';

import { FormatService } from '@nx-papelsa/shared/utils/ui-common';
import { capitalize } from '@nx-papelsa/shared/utils/collections';

@Component({
  selector: 'nx-papelsa-cxc-cobro-info',
  template: `
    <div class="info-panel">
      <mat-form-field *ngFor="let item of properties" [ngClass]="item.key">
        <mat-label>{{ item.label || capitalize(item.key) }}</mat-label>
        <input
          matInput
          disabled
          value="{{ getValue(item, cobro) }}"
          [ngClass]="item.className"
        />
        <mat-hint *ngIf="item.key === 'comentario'">
          Primera aplicación: {{ cobro.primeraAplicacion | date: 'dd/MM/yyyy' }}
        </mat-hint>
      </mat-form-field>
    </div>
    <div class="cfdi-panel" *ngIf="cobro.cfdi as cfdi">
      <mat-form-field *ngFor="let item of cfdiProperties" [ngClass]="item.key">
        <mat-label>{{ item.label || capitalize(item.key) }}</mat-label>
        <input
          matInput
          disabled
          value="{{ getValue(item, cfdi) }}"
          [ngClass]="item.className"
        />
      </mat-form-field>
    </div>
  `,
  styles: [
    `
      .info-panel {
        display: grid;
        align-self: center;
        grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
        grid-gap: 5px;
        padding: 10px 0 5px;
      }

      .cfdi-panel {
        display: grid;
        align-self: center;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        grid-gap: 10px;
        padding: 10px 0 5px;
      }

      .accent {
        color: blue;
      }
      .referencia {
        width: 90px;
      }
      .moneda {
        width: 90px;
      }
      .tipoDeCambio {
        width: 90px;
      }
      .comentario {
        grid-column: span 3;
      }
      .email,
      .uuid {
        grid-column: span 3;
      }
    `,
  ],
})
export class CobroInfoComponent implements OnInit {
  @Input() cobro: Partial<Cobro>;

  @Input() properties: PropertyItem[] = [
    { key: 'formaDePago', type: 'string', label: 'Forma de pago' },
    { key: 'referencia', type: 'string' },
    { key: 'comentario', type: 'string' },
    { key: 'moneda', type: 'string' },
    { key: 'tipoDeCambio', type: 'number', label: 'Tipo de cambio' },
    { key: 'importe', type: 'currency', className: 'accent' },
    { key: 'aplicado', type: 'currency', className: 'accent' },
    { key: 'diferencia', type: 'currency', className: 'accent' },
    {
      key: 'saldo',
      type: 'currency',
      className: 'accent',
      label: 'Disponible',
    },
  ];

  cfdiProperties: PropertyItem[] = [
    { key: 'serie', type: 'string' },
    { key: 'folio', type: 'string' },
    { key: 'fecha', type: 'date' },
    { key: 'uuid', type: 'string', label: 'UUID' },
    { key: 'enviado', type: 'date', label: 'Enviado' },
    { key: 'email', type: 'string', label: 'Email:' },
  ];

  constructor(private service: FormatService) {}

  ngOnInit() {}

  getValue(item: PropertyItem, entity: any) {
    const value = entity[item.key];
    switch (item.type) {
      case 'date':
        return this.service.formatDate(value);
      case 'currency':
        return this.service.formatCurrency(value);
      default:
        return value;
    }
  }
  capitalize(s: string) {
    return capitalize(s);
  }
}
