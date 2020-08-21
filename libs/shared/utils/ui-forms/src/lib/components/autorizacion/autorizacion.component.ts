import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { AutorizacionDialogComponent } from './autorizacion-dialog.component';

@Component({
  selector: 'nx-papelsa-autorizacion',
  template: `
    <button
      color="primary"
      mat-button
      (click)="autorizar()"
      [disabled]="disabled"
      [matTooltip]="toolTip"
    >
      <mat-icon>verified_user</mat-icon>
      <span>Autorizar</span>
    </button>
  `,
  styles: [``],
})
export class AutorizacionComponent implements OnInit {
  @Input() toolTip = 'Autorizar operación';
  @Input() descripcion: string;
  @Input() disabled = false;
  @Output() autorizacion = new EventEmitter();

  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  autorizar() {
    this.dialog
      .open(AutorizacionDialogComponent, {
        data: { descripcion: this.descripcion },
      })
      .afterClosed()
      .subscribe((res) => {
        if (!!res) {
          this.autorizacion.emit(res);
        }
      });
  }
}
