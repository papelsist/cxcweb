import { Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'nx-papelsa-ag-printer-renderer',
  template: `
    <button mat-icon-button><mat-icon color="primary">print</mat-icon></button>
  `,
})
export class AgPrinterRendererComponent implements ICellRendererAngularComp {
  private params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params: any): boolean {
    return false;
  }
}
