import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CuentaPorCobrar } from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'nx-papelsa-cxc-dialog',
  template: `
    <nx-papelsa-cxc-panel [cxc]="cxc"></nx-papelsa-cxc-panel>
    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]>
        <span>Cancelar</span>
      </button>
      <!-- <ng-container *ngIf="cxc.cfdi as cfdi">
        <nx-papelsa-cfdi-pdf [cfdi]="cfdi"></nx-papelsa-cfdi-pdf>
        <nx-papelsa-cfdi-xml [cfdi]="cfdi"></nx-papelsa-cfdi-xml>
        <nx-papelsa-cfdi-email
          [cfdi]="cfdi"
          [target]="cfdi.email"
        ></nx-papelsa-cfdi-email>
      </ng-container> -->
    </mat-dialog-actions>
  `,
})
export class CxcDialogComponent {
  cxc: CuentaPorCobrar;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<CxcDialogComponent, any[]>
  ) {
    this.cxc = data.cxc;
  }

  close() {}
}
