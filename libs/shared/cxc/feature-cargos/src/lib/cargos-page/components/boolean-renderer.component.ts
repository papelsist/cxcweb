import { Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'nx-papelsa-ag-boolean-renderer',
  template: ` <mat-icon *ngIf="checked" color="primary">check</mat-icon> `,
})
export class BooleanRendererComponent implements ICellRendererAngularComp {
  private params: any;

  checked = false;

  agInit(params: any): void {
    this.params = params;
    this.checked = this.params.value;
  }

  refresh(params: any): boolean {
    return false;
  }
}
