import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

import { Cliente } from '@nx-papelsa/shared/utils/core-models';
import { MatDialog } from '@angular/material/dialog';
import { GeneralesFormComponent } from '../generales-form/generales-form.component';
import { Update } from '@ngrx/entity';

@Component({
  selector: 'nx-papelsa-generales-card',
  templateUrl: './generales-card.component.html',
  styleUrls: ['./generales-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralesCardComponent implements OnInit {
  @Input() cliente: Cliente;
  @Output() edit = new EventEmitter<Update<Cliente>>();
  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  editar(cliente: Cliente) {
    this.dialog
      .open(GeneralesFormComponent, {
        data: { cliente },
      })
      .afterClosed()
      .subscribe((res: Update<Cliente>) => {
        if (res) {
          this.edit.emit(res);
        }
      });
  }
}
