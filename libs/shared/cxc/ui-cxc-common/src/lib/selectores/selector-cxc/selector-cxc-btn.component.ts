import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { delay, switchMap, tap } from 'rxjs/operators';

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
      >
        <mat-icon>playlist_add_check</mat-icon>
        <span>{{ title }}</span>
      </button>
      <ng-template #onlyIcon>
        <button
          mat-button
          mat-icon-button
          [color]="color"
          (click)="seleccionar()"
          [disabled]="disabled"
        >
          <mat-icon>playlist_add_check</mat-icon>
        </button>
      </ng-template>
    </ng-template>
  `,
})
export class SelectorCxcBtnComponent implements OnInit {
  @Input() color = 'primary';
  @Input() title: string;
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
        tap(() => (this.loading = false)),
        switchMap((facturas) =>
          this.dialog
            .open(SelectorCxcComponent, {
              data: { facturas, excludes: this.excludes },
            })
            .afterClosed()
        )
      )
      .subscribe((res) => this.selection.emit(res));
  }
}
