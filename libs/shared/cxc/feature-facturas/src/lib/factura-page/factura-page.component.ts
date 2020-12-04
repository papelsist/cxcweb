import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TdDialogService } from '@covalent/core/dialogs';

import { FacturasFacade } from '@nx-papelsa/shared/cxc/data-access-facturas';
import { CuentaPorCobrar } from '@nx-papelsa/shared/utils/core-models';
import { ReportService } from '@nx-papelsa/shared/utils/ui-forms';
import { ToJuridicoDialogComponent } from './components';

@Component({
  selector: 'nx-papelsa-factura-page',
  templateUrl: './factura-page.component.html',
  styleUrls: ['./factura-page.component.scss'],
})
export class FacturaPageComponent implements OnInit {
  factura$ = this.facade.selectedFactura$;
  constructor(
    private facade: FacturasFacade,
    private dialog: MatDialog,
    private reports: ReportService,
    private dialogService: TdDialogService
  ) {}

  ngOnInit(): void {}

  async onJuridico(cxc: Partial<CuentaPorCobrar>) {
    const dialog = this.dialog.open(ToJuridicoDialogComponent, {
      data: { factura: cxc },
      width: '500px',
    });
    const res = await dialog.afterClosed().toPromise();
    if (res) {
      this.facade.toJuridico(res);
    }
  }

  generarPagare(cxc: CuentaPorCobrar) {
    const url = 'cuentasPorCobrar/generarPagare';
    this.reports.runReport(url, { id: cxc.id });
  }

  saldar(cxc: CuentaPorCobrar) {
    this.dialogService
      .openConfirm({
        title: 'Factura: ' + cxc.documento,
        message: 'Saldar el pendiente: ' + cxc.saldoReal,
        acceptButton: 'Aceptar',
        cancelButton: 'Cancelar',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.facade.saldar(cxc);
        }
      });
  }
}
