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

@Component({
  selector: 'nx-papelsa-contado-page',
  templateUrl: './contado-page.component.html',
  styleUrls: ['./contado-page.component.scss'],
})
export class ContadoPageComponent implements OnInit {
  features: NavigationRoute[] = [
    {
      path: 'facturas',
      label: 'Facturas',
      description: 'Cuentas por cobrar ',
      icon: 'toc',
    },
    {
      path: 'bonificaciones',
      label: 'Bonificaciones',
      description: 'Notas de crédito por descuento',
      icon: 'all_inbox',
    },
    {
      path: 'devoluciones',
      label: 'Devoluciones',
      description: 'Notas de crédito por devolución',
      icon: 'thumb_down_alt',
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
    // private clientesUi: ClientesUiService,
    private router: Router
  ) {
    console.log('Contado main page loaded...');
    this.cartera$ = facade.cartera$;
  }

  ngOnInit(): void {}

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
}
