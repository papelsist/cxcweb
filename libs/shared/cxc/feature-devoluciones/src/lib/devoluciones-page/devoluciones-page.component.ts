import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { BehaviorSubject } from 'rxjs';
import { map, filter, takeUntil } from 'rxjs/operators';

import {
  DevolucionesFacade,
  DevolucionesEntity,
} from '@nx-papelsa/shared/cxc/data-access-devoluciones';

import {
  Periodo,
  Cartera,
  NotaDeCredito, Devolucion, SAT_FORMAS_DE_PAGO
} from '@nx-papelsa/shared/utils/core-models';

import { DevolucionCreateDialogComponent } from '@nx-papelsa/shared/cxc/ui-devoluciones';
import { BaseComponent } from '@nx-papelsa/shared/utils/ui-common';

@Component({
  selector: 'nx-papelsa-devoluciones-page',
  templateUrl: './devoluciones-page.component.html',
  styleUrls: ['./devoluciones-page.component.scss'],
})
export class DevolucionesPageComponent extends BaseComponent implements OnInit {
  cartera$ = this.facade.cartera$;
  loading$ = this.facade.loading$;
  periodo$ = this.facade.periodo$;
  search$ = this.facade.search$;
  devoluciones$ = this.facade.allDevoluciones$;

  _selected$ = new BehaviorSubject<DevolucionesEntity[]>([]);
  selected$ = this._selected$.asObservable();
  disponiblesEnvio$ = this.selected$.pipe(
    map((selected) => selected.filter((item) => item.cfdi))
  );

  constructor(private facade: DevolucionesFacade, private dialog: MatDialog) {
    super();
  }

  ngOnInit(): void {
    this.facade.loaded$
      .pipe(
        filter((loaded) => !loaded),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.reload());
  }

  reload() {
    this.facade.loadDevoluciones();
  }

  onPeriodoChanged(periodo: Periodo) {
    this.facade.cambiarPeriodo(periodo);
  }
  filter(event: string) {
    this.facade.setSearchTerm(event);
  }

  onCreate(cartera: Cartera) {
    this.dialog
      .open(DevolucionCreateDialogComponent, {
        data: { cartera },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          console.log('Alta de Devolucion: ', res);
          this.facade.save(res);
        }
      });
  }

  onDrillDown(event: Partial<NotaDeCredito>, cartera: Cartera) {
    this.facade.edit(event, cartera);
  }
  onSelection(event: NotaDeCredito[]) {
    this._selected$.next(event);
  }

  /**
   * this.form = this.fb.group({
      tipoCartera: [this.cartera.clave, [Validators.required]],
      tipo: ['DEVOLUCION'],
      serie: [`DEV${this.cartera.clave}`],
      cliente: [null, [Validators.required]],
      formaDePago: [SAT_FORMAS_DE_PAGO.CONTONACION.clave, Validators.required],
      usoDeCfdi: ['G01', [Validators.required]],
      moneda: ['MXN', [Validators.required]],
      concepto: ['DEVOLUCION', [Validators.required]],
      comentario: [],
    });
   * @param rmd
   */
  agregarPorRmd(event: Partial<Devolucion[]>, cartera: Cartera) {
    const rmd  = event[0];
    // console.log('RMD: ', rmd);
    const res =  {
      tipoCartera: cartera.clave,
      tipo: 'DEVOLUCION',
      serie: `DEV${cartera.clave}`,
      cliente: {id: rmd.venta.cliente.id},
      formaDePago: SAT_FORMAS_DE_PAGO.CONTONACION.clave,
      usoDeCfdi: 'G01',
      moneda: rmd.venta.moneda,
      tc: rmd.venta.tipoDeCambio,
      concepto: 'DEVOLUCION',
      importe: rmd.importe,
      impuesto: rmd.impuesto,
      total: rmd.total,
      devolucion: {id: rmd.id},
      comentario: rmd.comentario,
      sucursal: {id: rmd.sucursal.id}
    } as NotaDeCredito
    // console.log('Nota por salvar: ', res);
    this.facade.save(res)
  }
}
