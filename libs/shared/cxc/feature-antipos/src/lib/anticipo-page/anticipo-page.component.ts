import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BehaviorSubject, Observable, Subject } from 'rxjs';

import {
  AnticipoSatDet,
  AplicacionDeCobro,
  Cfdi,
} from '@nx-papelsa/shared/utils/core-models';
import { AnticiposService } from '../+state/anticipos.service';
import { TdDialogService } from '@covalent/core/dialogs';

@Component({
  selector: 'nx-papelsa-anticipos-page',
  templateUrl: './anticipo-page.component.html',
  styleUrls: ['./anticipo-page.component.scss'],
})
export class AnticipoPageComponent implements OnInit {
  aplicacion$: Observable<AnticipoSatDet>;

  constructor(
    private route: ActivatedRoute,
    private service: AnticiposService,
    private dialogservce: TdDialogService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    const id = this.route.snapshot.paramMap.get('id');
    this.aplicacion$ = this.service.get(id);
  }

  generarCfdi(aplicacion: AnticipoSatDet) {
    this.dialogservce
      .openConfirm({
        title: 'Generación de CFDI',
        message: 'Timbrar la aplicación?',
        acceptButton: 'Aceptar',
        cancelButton: 'Cancelar',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          console.log('Genera anticipo');
          this.service.generarCfdi(aplicacion.id).subscribe(
            (result) => {
              this.load();
            },
            (error) => console.error('Error: ', error)
          );
        }
      });
  }

  getEgresoCfdi(apl: AnticipoSatDet): Partial<Cfdi> {
    if (apl && apl.egresoUuid)
      return { id: apl.egresoCfdi, uuid: apl.egresoUuid };
    return null;
  }
}
