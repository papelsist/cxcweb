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

import { DepositoCreateComponent } from './deposito-create.component';

@Component({
  selector: 'nx-papelsa-deposito-create-btn',
  template: `
    <button mat-icon-button color="primary" (click)="show()">
      <mat-icon>add</mat-icon>
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
        data: {
          buscarDuplicado: this.buscarDuplicado,
        },
        width: '40%',
      })
      .afterClosed()
      .subscribe((deposito) => {
        if (deposito) {
          this.create.emit(deposito);
        }
      });
  }

  async buscarDuplicado(total: number, banco: any): Promise<Deposito | null> {
    console.log('Buscando duplicado de: ', total);
    console.log('Banco: ', banco);
    return null;
    /*
    return this.afs
      .collection('depositos', ref =>
        ref.where('total', '==', total).where('banco', '==', banco)
      )
      .snapshotChanges()
      .pipe(
        take(1),
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Deposito;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
      */
  }
}
