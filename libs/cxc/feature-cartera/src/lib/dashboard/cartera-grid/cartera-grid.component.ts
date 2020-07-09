import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import {
  sumByProperty,
  MonedaUtils,
} from '@nx-papelsa/shared/utils/collections';

import { CarteraPorClienteDto } from '@nx-papelsa/shared/utils/core-models';

import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'papx-cxc-cartera-grid',
  templateUrl: './cartera-grid.component.html',
  styleUrls: ['./cartera-grid.component.scss'],
})
export class CarteraGridComponent implements OnInit {
  private _data: CarteraPorClienteDto[] = [];
  @Input() displayColumns = ['select', 'nombre', 'saldo', 'part'];

  dataSource = new MatTableDataSource(this._data);

  @Input() initialSelection = [];
  @Input() allowMultiSelect = true;
  @Output() changeSelection = new EventEmitter<CarteraPorClienteDto[]>();

  selection: SelectionModel<CarteraPorClienteDto>;

  saldoTotal = 0;

  constructor() {}

  ngOnInit(): void {
    this.selection = new SelectionModel<CarteraPorClienteDto>(
      this.allowMultiSelect,
      this.initialSelection
    );
  }

  filter(value: string) {
    this.dataSource.filter = value;
  }

  @Input() set data(rows: any[]) {
    this._data = rows;
    this.dataSource = new MatTableDataSource(this._data);
    this.saldoTotal = sumByProperty(this.dataSource.data, 'saldo');
  }

  private dispatchSelection() {
    this.changeSelection.emit(this.selection.selected);
  }

  selectRow(row: CarteraPorClienteDto) {
    this.selection.select(row);
    this.dispatchSelection();
  }

  toggleRow(row: CarteraPorClienteDto) {
    this.selection.toggle(row);
    this.dispatchSelection();
  }

  clearSelection() {
    this.selection.clear();
    this.dispatchSelection();
  }

  selectAll() {
    this.dataSource.data.forEach((row) => this.selectRow(row));
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /**
   * Selects all rows if they are not all selected; otherwise clear selection.
   */
  masterToggle() {
    const allSelected = this.isAllSelected();
    this.isAllSelected() ? this.clearSelection() : this.selectAll();
  }

  getParticipacion(saldo: number) {
    return saldo / this.saldoTotal;
  }

  getSelectedPart() {
    return this.selection.selected.reduce(
      (prev, current) => this.getParticipacion(current.saldo) + prev,
      0
    );
  }
}
