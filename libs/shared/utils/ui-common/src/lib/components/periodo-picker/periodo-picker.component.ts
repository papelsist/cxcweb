import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Periodo } from '@nx-papelsa/shared/utils/core-models';
import { PeriodoDialogComponent } from '../periodo-dialog/periodo-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'nx-papelsa-periodo-picker',
  template: `
    <button color="primary" mat-button (click)="seleccionar()">
      <mat-icon>event</mat-icon> {{ periodo.toString() }}
    </button>
  `,
  styles: [``],
})
export class PeriodoPickerComponent implements OnInit {
  @Input() toolTip = 'Cambiar el periodo';

  @Input() periodo = new Periodo();
  @Output() periodoChanged = new EventEmitter();

  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  seleccionar() {
    this.dialog
      .open(PeriodoDialogComponent, {
        data: { periodo: this.periodo },
      })
      .afterClosed()
      .subscribe((res) => {
        if (!!res) {
          this.periodoChanged.emit(res);
        }
      });
  }
}
