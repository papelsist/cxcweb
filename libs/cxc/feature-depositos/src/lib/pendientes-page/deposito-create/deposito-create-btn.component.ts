import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { Deposito } from '@nx-papelsa/shared/cxc/data-access-depositos';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { DepositoCreateComponent } from './deposito-create.component';

@Component({
  selector: 'nx-papelsa-deposito-create-btn',
  template: `
    <button mat-menu-item color="primary" (click)="show()">
      <mat-icon>add</mat-icon>
      Nuevo
    </button>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepositoCreateBtnComponent implements OnInit {
  @Output() create = new EventEmitter<Deposito>();
  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  show() {
    this.dialog
      .open(DepositoCreateComponent, {
        width: '60%',
        minHeight: '500px',
        data: {},
      })
      .afterClosed()
      .subscribe((deposito) => {
        if (deposito) {
          this.create.emit(deposito);
        }
      });
  }
}
