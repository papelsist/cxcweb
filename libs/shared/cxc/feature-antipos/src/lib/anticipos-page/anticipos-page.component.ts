import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';

import { groupByProperty } from '@nx-papelsa/shared/utils/collections';
import { AnticipoSatDet, Periodo } from '@nx-papelsa/shared/utils/core-models';
import { AnticiposService } from '../+state/anticipos.service';

@Component({
  selector: 'nx-papelsa-anticipos-page',
  templateUrl: './anticipos-page.component.html',
  styleUrls: ['./anticipos-page.component.scss'],
})
export class AnticiposPageComponent implements OnInit {
  periodo: Periodo;
  cartera: { clave: string; descripcion: string };
  filter$ = new BehaviorSubject<string>('');
  STORAGE_KEY = 'nx-papelsa-cxc-anticipos-page.periodo';
  selected: AnticipoSatDet[] = [];
  anticipos: AnticipoSatDet[] = [];

  anticipos$: Observable<AnticipoSatDet[]>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: AnticiposService
  ) {
    this.periodo = Periodo.fromNow(30);
  }

  ngOnInit(): void {
    this.cartera = this.route.snapshot.data.cartera;
    this.reload();
  }

  reload() {
    this.service.list(this.periodo, this.cartera.clave).subscribe(
      (res) => (this.anticipos = res),
      (response) => console.error('Error: ', response)
    );
  }

  filter(event: string) {
    this.filter$.next(event);
  }

  onDrilldown(event: AnticipoSatDet) {
    this.router.navigate([event.id], { relativeTo: this.route });
  }

  getDisponiblesParaEnvio() {
    return this.selected.filter((item) => item.cfdi);
  }
  onSelection(event: AnticipoSatDet[]) {
    this.selected = event;
  }

  enviarPorCorreo(disponibles: AnticipoSatDet[]) {
    const grupos = groupByProperty(disponibles, 'cliente');
    console.log(grupos);
  }

  onPeriodoChanged(periodo: Periodo) {
    this.periodo = periodo;
    Periodo.saveOnStorage(this.STORAGE_KEY, periodo);
    this.reload();
  }
}
