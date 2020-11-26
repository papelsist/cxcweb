import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import {
  NavigationRoute,
  Periodo,
  Cartera,
} from '@nx-papelsa/shared/utils/core-models';
import { ReportService } from '@nx-papelsa/shared/utils/ui-forms';
import { CXCFacade } from '@nx-papelsa/shared/cxc/data-acces';

import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FechaDialogComponent } from '@nx-papelsa/shared/utils/ui-common';

import * as moment from 'moment';

@Component({
  selector: 'nx-papelsa-juridico-page',
  templateUrl: './juridico-page.component.html',
  styleUrls: ['./juridico-page.component.scss'],
})
export class JuridicoPageComponent implements OnInit {
  features: NavigationRoute[] = [
    {
      path: 'facturas',
      label: 'CxC',
      description: 'Cuentas por cobrar ',
      icon: 'toc',
    },
    {
      path: 'cobros',
      label: 'Cobros',
      description: 'Aplicaciones de cobros',
      icon: 'payments',
    },
    {
      path: 'bonificaciones',
      label: 'Bonificaciones',
      description: 'Notas de crédito por descuento',
      icon: 'all_inbox',
    },

    {
      path: 'cargos',
      label: 'Cargos',
      description: 'Notas de cargo',
      icon: 'playlist_add',
    },
  ];

  cartera$: Observable<Cartera>;

  constructor(
    private facade: CXCFacade,
    private reportService: ReportService,
    private router: Router,
    private dialog: MatDialog
  ) {
    console.log('Credito main page loaded...');
    this.cartera$ = facade.cartera$;
  }

  ngOnInit(): void {}

  reporteDeCobranza(cartera: Cartera) {
    const url = 'cxc/cobro/reporteDeCobranza';
    const params = { cartera: cartera.clave };
    const key = `sx.papelsa.cobranza.fecha.${cartera.clave.toLowerCase()}`;
    const pfecha = Periodo.fromStorage(key, Periodo.fromNow(1));
    this.reportService.runReportePorFecha(
      url,
      pfecha.fechaFinal,
      params,
      `Cobranza (${cartera.descripcion})`,
      null,
      (fecha: Date) => {
        const resPer = new Periodo(fecha, fecha);
        Periodo.saveOnStorage(key, resPer);
      }
    );
  }

  cuentasPorAbogado(cartera: Cartera) {
    this.dialog
      .open(FechaDialogComponent, {
        data: {
          title: 'Estado de cuenta GENERAL',
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          const fecha = moment(res).format('DD/MM/yyyy');
          const url = 'cxc/cheques/estadoDeCuentaGeneralChe';
          const params = { ORIGEN: cartera.clave, fecha };
          this.reportService.runReport(
            url,
            params,
            `Eestado de cuenta general (${cartera.descripcion})`
          );
        }
      });
  }

  reporteDeNotas(cartera: Cartera) {
    const url = 'cxc/notas/reporteDeNotasDeCredito';
    const params = { ORIGEN: cartera.clave };
    const key = `sx.papelsa.notas.periodo.${cartera.clave.toLowerCase()}`;
    const periodo = Periodo.fromStorage(key, Periodo.mesActual());
    this.reportService.runReportePorPeriodo(
      url,
      periodo,
      params,
      `Notas de Crédito (${cartera.descripcion})`,
      null,
      (per: Periodo) => {
        Periodo.saveOnStorage(key, per);
      }
    );
  }
}
