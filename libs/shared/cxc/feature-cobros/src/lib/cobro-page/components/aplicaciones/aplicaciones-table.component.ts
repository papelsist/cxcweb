import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ChangeDetectionStrategy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { AplicacionDeCobro } from '@nx-papelsa/shared/utils/core-models';
import { MatTableDataSource } from '@angular/material/table';
import { sumByProperty, sumByFn } from '@nx-papelsa/shared/utils/collections';
import sumBy from 'lodash/sumBy';

@Component({
  selector: 'nx-papelsa-cobro-aplicaciones',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './aplicaciones-table.component.html',
  styleUrls: ['./aplicaciones-table.component.scss'],
})
export class AplicacionesTableComponent implements OnInit, OnChanges {
  @Input() aplicaciones: AplicacionDeCobro[] = [];

  @Output() delete = new EventEmitter();
  @Input() filtro;
  @Input() disabled = false;

  displayColumns = [
    'sucursal',
    'serieDocumento',
    'folioDocumento',
    'uuid',
    'fechaDocumento',
    'moneda',
    'tipoDeCambio',
    'fecha',
    'totalDocumento',
    'pagosDocumento',
    'saldoDocumento',
    'importe',
    'updateUser',
    'operaciones',
  ];

  dataSource = new MatTableDataSource<AplicacionDeCobro>([]);

  // @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() {}

  ngOnInit() {
    // this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.aplicaciones && changes.aplicaciones.currentValue) {
      this.dataSource.data = changes.aplicaciones.currentValue;
    }
    if (changes.filtro && changes.filtro.currentValue) {
      this.dataSource.filter = changes.filtro.currentValue;
    }
  }

  getTotal(property: string) {
    const total = sumByProperty(this.dataSource.filteredData, property);
    return total;
  }

  getTotalMn(ap: AplicacionDeCobro) {
    return sumByFn(
      this.dataSource.filteredData,
      (item) => item.tipoDeCambio * item.importe
    );
  }
}

/**
 * columns: ITdDataTableColumn[] = [
    {
      name: 'cuentaPorCobrar.sucursal.nombre',
      label: 'Sucursal',
      sortable: true,
      width: 120,
      nested: true
    },

    {
      name: 'cuentaPorCobrar.tipo',
      label: 'Tipo',
      sortable: true,
      width: 90,
      nested: true
    },
    {
      name: 'cuentaPorCobrar.documento',
      label: 'Docto',
      filter: true,
      sortable: true,
      width: 100
    },
    {
      name: 'fecha',
      label: 'Fecha',
      width: 110,
      format: date => this.datePipe.transform(date, 'dd/MM/yyyy')
    },
    {
      name: 'cuentaPorCobrar.total',
      label: 'Tot Dcto',
      width: 150,
      numeric: true,
      sortable: true,
      filter: true,
      nested: true,
      format: value => this.currencyPipe.transform(value, 'USD')
    },
    {
      name: 'cuentaPorCobrar.saldo',
      label: 'Saldo Dcto',
      width: 140,
      numeric: true,
      sortable: true,
      filter: true,
      nested: true,
      format: value => this.currencyPipe.transform(value, 'USD')
    },
    {
      name: 'importe',
      label: 'Aplicado',
      width: 140,
      numeric: true,
      sortable: true,
      filter: true,
      format: value => this.currencyPipe.transform(value, 'USD')
    }
  ];


4772 1330 0272 9892
4772 1330 0272 9892.
 */
