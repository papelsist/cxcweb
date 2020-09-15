import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

import { NotaDeCreditoDet } from '@nx-papelsa/shared/utils/core-models';

import { sumByProperty } from '@nx-papelsa/shared/utils/collections';

@Component({
  selector: 'nx-papelsa-bonificacion-partidas-table',
  templateUrl: './bonificacion-partidas-table.component.html',
  styleUrls: ['./bonificacion-partidas-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BonificacionPartidasTableComponent implements OnInit {
  @Input() partidas: NotaDeCreditoDet[] = [];
  @Input() baseDelCalculo;
  @Input() manual = false;

  @Output() delete = new EventEmitter<{
    index: number;
    item: NotaDeCreditoDet;
  }>();

  @Output() edit = new EventEmitter<{
    index: number;
    item: NotaDeCreditoDet;
  }>();
  @Input() disabled = false;

  displayColumns = [
    'documento',
    'tipoDeDocumento',
    'sucursal',
    'uuid',
    'fechaDocumento',
    'totalDocumento',
    'saldoDocumento',
    'importe',
    'impuesto',
    'total',
    'operaciones',
  ];

  constructor() {}

  ngOnInit() {}

  getTotal(property: string) {
    const total = sumByProperty(this.partidas, property);
    return total;
  }

  onDelete(index: number, item: NotaDeCreditoDet) {
    this.delete.emit({ index, item });
  }
  onEdit(index: number, item: NotaDeCreditoDet) {
    this.edit.emit({ index, item });
  }
}
