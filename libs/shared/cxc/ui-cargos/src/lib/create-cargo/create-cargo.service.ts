import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { NotaDeCargoCreateDto } from '@nx-papelsa/shared/utils/core-models';
import { CreateCargoComponent } from './create-cargo.component';

@Injectable()
export class CreateCargoService {
  constructor(private dialog: MatDialog) {}

  createCarto(cartera: string): Observable<NotaDeCargoCreateDto | null> {
    return this.dialog
      .open(CreateCargoComponent, { data: { cartera } })
      .afterClosed();
  }
}
