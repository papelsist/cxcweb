import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';

import { CargosService } from '@nx-papelsa/shared/cxc/data-acces';
import { NotaDeCargoDto } from '@nx-papelsa/shared/utils/core-models';
import { groupByProperty } from '@nx-papelsa/shared/utils/collections';
import { CreateCargoComponent } from '@nx-papelsa/shared/cxc/ui-cargos';

@Component({
  selector: 'nx-papelsa-cxc-cargos-page',
  templateUrl: './cargos-page.component.html',
  styleUrls: ['./cargos-page.component.scss'],
})
export class CargosPageComponent implements OnInit {
  cargos$: Observable<NotaDeCargoDto[]>;
  selected: NotaDeCargoDto[] = [];
  constructor(
    private service: CargosService,
    private router: Router,
    private route: ActivatedRoute,
    // private cargoService: CreateCargoService
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    // this.reload();
  }

  reload() {
    this.cargos$ = this.service.list();
  }

  create() {
    this.dialog.open(CreateCargoComponent, { data: { cartera: 'CRE' } });
    // this.cargoService
    //   .createCarto('CRE')
    //   .subscribe((dto) => console.log('DTO: ', dto));
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

  // isSendMailEnabled() {
  //   const disponibles = this.selected.filter((item) => item.cfdi);
  //   const grupos = groupByProperty(disponibles, 'nombre');

  // }
}
