import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { throwError } from 'rxjs';
import { delay, switchMap, tap, finalize, catchError } from 'rxjs/operators';

import { Devolucion } from '@nx-papelsa/shared/utils/core-models';
import { CxcService } from '@nx-papelsa/shared/cxc/data-acces';
import { RmdSelectorDialogComponent } from './rmd-selector-dialog.component';

@Component({
  selector: 'nx-papelsa-cxc-selector-rmd-btn',
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
export class RmdSelectorBtnComponent implements OnInit {
  @Input() color = 'primary';
  @Input() title = 'Seleccionar RMD';
  @Input() tooltip: string;
  @Input() clienteId: string;
  @Input() cartera = 'CRE';
  @Output() selection = new EventEmitter<Devolucion[]>();

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
      .rmdPendientes(this.clienteId, this.cartera)
      .pipe(
        delay(500),
        finalize(() => (this.loading = false)),
        catchError((error: any) => throwError(error))
      )
      .subscribe(
        (devoluciones) => this.doSeleccionar(devoluciones),
        (error) => console.error('Error ', error)
      );
  }

  doSeleccionar(devoluciones: Devolucion[]) {
    this.dialog
      .open(RmdSelectorDialogComponent, {
        data: { rmds: devoluciones, excludes: this.excludes },
        width: '85%',
      })
      .afterClosed()
      .subscribe((selected) => {
        if (selected) this.selection.emit(selected);
      });
  }
}
