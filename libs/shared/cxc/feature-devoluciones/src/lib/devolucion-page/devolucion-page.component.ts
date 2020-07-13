import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

import { TdDialogService } from '@covalent/core/dialogs';

import { Devolucion } from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'nx-papelsa-devolucion-page',
  templateUrl: './devolucion-page.component.html',
  styleUrls: ['./devolucion-page.component.scss'],
})
export class DevolucionPageComponent implements OnInit {
  devolucion$: Observable<Devolucion>;
  constructor(
    private route: ActivatedRoute,
    private _dialogService: TdDialogService
  ) {}

  ngOnInit(): void {
    console.log('Route: ', this.route.snapshot.data);
    //this.devolucion$ = this.route.data.map()
    this.devolucion$ = this.route.data.pipe(pluck('devolucion'));
  }

  generarNota(devolucion: Partial<Devolucion>) {
    this._dialogService
      .openConfirm({
        message: 'Generar nota de crédito ',
        title: 'Alert',
        cancelButton: 'Cancelar',
        acceptButton: 'Generar',
      })
      .afterClosed()
      .subscribe((accept: boolean) => {
        if (accept) {
          console.log('Generar nota de crédito');
        }
      });
  }
}
