import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { throwError } from 'rxjs';
import { delay, switchMap, tap, finalize, catchError } from 'rxjs/operators';

import { CuentaPorCobrarDTO } from '@nx-papelsa/shared/utils/core-models';
import { CxcService } from '@nx-papelsa/shared/cxc/data-acces';
import { SelectorCxcComponent } from './selector-cxc.component';

@Component({
  selector: 'nx-papelsa-cxc-selector-cxc-btn',
  template: `
    <ng-template
      tdLoading
      [tdLoadingUntil]="!loading"
      tdLoadingStrategy="overlay"
    >
      <button
        mat-button
        [color]="color"
        *ngIf="title; else onlyIcon"
        (click)="seleccionar()"
        [disabled]="disabled"
        [matTooltip]="tooltip"
      >
        <mat-icon>playlist_add</mat-icon>
        <span>{{ title }}</span>
      </button>
      <ng-template #onlyIcon>
        <button
          mat-button
          mat-icon-button
          [color]="color"
          (click)="seleccionar()"
          [disabled]="disabled"
          [matTooltip]="tooltip"
        >
          <mat-icon>playlist_add</mat-icon>
        </button>
      </ng-template>
    </ng-template>
  `,
})
export class SelectorCxcBtnComponent implements OnInit {
  @Input() color = 'primary';
  @Input() title: string;
  @Input() tooltip: string;
  @Input() clienteId: string;
  @Output() selection = new EventEmitter<CuentaPorCobrarDTO[]>();

  /*
   * Lista de Facturas (ids) a exluir del selector
   */
  @Input() excludes: string[];
  @Input() disabled = false;

  loading = false;
  constructor(private service: CxcService, private dialog: MatDialog) {}

  ngOnInit() {}

  seleccionar() {
    this.loading = true;
    this.service
      .facturasPendientes(this.clienteId)
      .pipe(
        delay(500),
        finalize(() => (this.loading = false)),
        catchError((error: any) => throwError(error))
      )
      .subscribe(
        (facturas) => this.doSeleccionar(facturas),
        (error) => console.error('Error ', error)
      );
  }

  doSeleccionar(facturas: CuentaPorCobrarDTO[]) {
    this.dialog
      .open(SelectorCxcComponent, {
        data: { clienteId: this.clienteId, facturas, excludes: this.excludes },
        width: '75%',
      })
      .afterClosed()
      .subscribe((selected) => {
        if (selected) this.selection.emit(selected);
      });
  }
}
