import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { map, switchMap, shareReplay } from 'rxjs/operators';

import { NotaDeCargo } from '@nx-papelsa/shared/utils/core-models';
import { CargosService } from '@nx-papelsa/shared/cxc/data-acces';
import { TdDialogService } from '@covalent/core/dialogs';

@Component({
  selector: 'nx-papelsa-cargo-page',
  templateUrl: './cargo-page.component.html',
  styleUrls: ['./cargo-page.component.scss'],
})
export class CargoPageComponent implements OnInit {
  cargo$: Observable<NotaDeCargo>;

  constructor(
    private route: ActivatedRoute,
    private service: CargosService,
    private dialogService: TdDialogService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.cargo$ = this.route.paramMap.pipe(
      map((params) => params.get('cargoId')),
      shareReplay(),
      switchMap((id) => this.service.get(id))
    );
  }

  onUpdate(event: { id: string; changes: Partial<NotaDeCargo> }) {
    console.log('Actualizar: ', event);
    this.service.update(event).subscribe(
      (res) => {
        console.log('Res: ', res);
        this.load();
      },
      (error) => {
        console.error('Error al actualizar Nota de cargo', error);
        this.dialogService.openAlert({
          title: 'Error actualizando Cargo',
          message: `(${error.status}) ${error?.error?.message}`,
          closeButton: 'Cerrar',
        });
      }
    );
  }
}
