import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';

import { CargosService } from '@nx-papelsa/shared/cxc/data-acces';
import {
  NotaDeCargoDto,
  NotaDeCargoCreateDto,
  Periodo,
} from '@nx-papelsa/shared/utils/core-models';
import { groupByProperty } from '@nx-papelsa/shared/utils/collections';

import { CreateCargoDialogComponent } from './components';

@Component({
  selector: 'nx-papelsa-cxc-cargos-page',
  templateUrl: './cargos-page.component.html',
  styleUrls: ['./cargos-page.component.scss'],
})
export class CargosPageComponent implements OnInit {
  cargos$: Observable<NotaDeCargoDto[]>;
  selected: NotaDeCargoDto[] = [];
  cartera: { clave: string; descripcion: string };
  periodo: Periodo;
  filter$ = new BehaviorSubject<string>('');

  STORAGE_KEY = 'nx-papelsa-cxc-cargos-page.periodo';

  constructor(
    private service: CargosService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.periodo = Periodo.fromStorage(this.STORAGE_KEY);
    console.log('Periodo: ', this.periodo);
  }

  ngOnInit() {
    this.cartera = this.route.snapshot.data.cartera;
    this.reload();
  }

  reload() {
    this.cargos$ = this.service.list(this.periodo, this.cartera.clave);
  }

  create() {
    this.dialog
      .open(CreateCargoDialogComponent, { data: { cartera: this.cartera } })
      .afterClosed()
      .pipe(filter((data) => data != null))
      .subscribe((dto) => this.doPersist(dto));
  }

  doPersist(dto: NotaDeCargoCreateDto) {
    this.service.save(dto).subscribe(
      (res) => console.log('Res: ', res),
      (err) => console.log('ERROR SALVANDO DTO: ', err)
    );
  }

  onDrilldown(event: NotaDeCargoDto) {
    this.router.navigate(['edit', event.id], { relativeTo: this.route });
  }
  onSelection(event: NotaDeCargoDto[]) {
    this.selected = event;
  }

  getDisponiblesParaEnvio() {
    return this.selected.filter((item) => item.cfdi);
  }

  enviarPorCorreo(disponibles: NotaDeCargoDto[]) {
    const grupos = groupByProperty(disponibles, 'cliente');
    console.log(grupos);
  }

  onPeriodoChanged(periodo: Periodo) {
    this.periodo = periodo;
    Periodo.saveOnStorage(this.STORAGE_KEY, periodo);
    this.reload();
  }
  filter(event: string) {
    this.filter$.next(event);
  }

  // isSendMailEnabled() {
  //   const disponibles = this.selected.filter((item) => item.cfdi);
  //   const grupos = groupByProperty(disponibles, 'nombre');

  // }
}
