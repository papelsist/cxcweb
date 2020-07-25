import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  Inject,
  LOCALE_ID,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { NotaDeCreditoDet } from '@nx-papelsa/shared/utils/core-models';
import { ITdDataTableColumn } from '@covalent/core/data-table';
import { BaseGridComponent } from '@nx-papelsa/shared/utils/ui-common';

@Component({
  selector: 'nx-papelsa-cxc-bonificacion-partidas-table',
  template: `
    <div class="partidas-container">
      <td-data-table [data]="partidas" [columns]="columns">
        <ng-template
          tdDataTableTemplate="renglon"
          let-index="index"
          let-value="value"
        >
          {{ index + 1 }}
        </ng-template>
        <ng-template
          tdDataTableTemplate="delete"
          let-index="index"
          let-value="value"
        >
          <button
            class="delete-button"
            mat-icon-button
            (click)="onDelete(index, value)"
            [disabled]="parent.disabled"
            color="warn"
          >
            <mat-icon>delete</mat-icon>
          </button>
        </ng-template>
      </td-data-table>
    </div>
  `,
  styles: [
    `
      .delete-button {
        // width: 50px;
        border: 0;
        margin: 0;
        flex: 1;
        // width: 100%;
        // align-self: flex-start;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BonificacionPartidasComponent extends BaseGridComponent
  implements OnInit {
  @Input() parent: FormGroup;

  private _partidas = [];

  @Output() delete = new EventEmitter<{ index: number; data: any }>();
  @Output() doubleClick = new EventEmitter();
  @Input() columns: ITdDataTableColumn[] = [
    { name: 'renglon', label: 'Rgl', width: 50 },
    { name: 'sucursal', label: 'Sucursal', width: 80 },
    { name: 'documento', label: 'Sucursal', width: 80 },
    { name: 'documentoTipo', label: 'Tipo', width: 80 },
    {
      name: 'uuid',
      label: 'UUID',
      width: 80,
      format: (value) => (value ? value.substr(-6) : ''),
    },
    {
      name: 'documentoFecha',
      label: 'Fecha',
      width: 90,
      format: (value) => this.formatDate(value),
    },
    {
      name: 'documentoTotal',
      label: 'Total',
      width: 100,
      format: (value) => this.formatCurrency(value),
    },
    {
      name: 'documentoSaldo',
      label: 'Saldo',
      width: 100,
      format: (value) => this.formatCurrency(value),
    },
    { name: 'cargo', label: 'Cargo', width: 100 },
    {
      name: 'importe',
      label: 'Importe',
      width: 100,
      format: (value) => this.formatCurrency(value),
    },
    {
      name: 'impuesto',
      label: 'Impuesto',
      width: 100,
      format: (value) => this.formatCurrency(value),
    },
    {
      name: 'total',
      label: 'Total',
      width: 100,
      format: (value) => this.formatCurrency(value),
    },
    {
      name: 'delete',
      label: ':',
      width: 50,
    },
  ];

  constructor(@Inject(LOCALE_ID) locale) {
    super(locale);
  }

  ngOnInit() {}

  compareWith(
    row: Partial<NotaDeCreditoDet>,
    model: NotaDeCreditoDet
  ): boolean {
    return row.id === model.id;
  }

  @Input()
  set partidas(value: NotaDeCreditoDet[]) {
    this._partidas = value;
  }

  get partidas() {
    return this._partidas;
  }

  onDelete(index: number, data: any) {
    this.delete.emit({ index, data });
  }
}
