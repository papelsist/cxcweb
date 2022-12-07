import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable, BehaviorSubject } from 'rxjs';
import { map, switchMap, shareReplay, finalize, delay } from 'rxjs/operators';

import { NotaDeCargo } from '@nx-papelsa/shared/utils/core-models';
import { CargosService } from '@nx-papelsa/shared/cxc/data-acces';
import { TdDialogService } from '@covalent/core/dialogs';
import { TdLoadingService } from '@covalent/core/loading';

@Component({
  selector: 'nx-papelsa-cargo-page',
  templateUrl: './cargo-page.component.html',
  styleUrls: ['./cargo-page.component.scss'],
})
export class CargoPageComponent implements OnInit {
  cargo$: Observable<NotaDeCargo>;

  _loading$ = new BehaviorSubject<boolean>(false);
  loading$ = this._loading$.asObservable();

  constructor(
    private route: ActivatedRoute,
    private service: CargosService,
    private dialogService: TdDialogService,
    private loadingService: TdLoadingService
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

  onTimbrar(cargo: Partial<NotaDeCargo>) {
    this.dialogService
      .openConfirm({
        title: 'Comprobante fiscal digital',
        message: 'Timbrar la nota de cargo: ' + cargo.folio,
        cancelButton: 'Cancelar',
        acceptButton: 'Timbrar',
      })
      .afterClosed()
      .subscribe((res) => this.doTimbrar(cargo));
  }

  onTimbrarV4(cargo: Partial<NotaDeCargo>) {
    console.log('Timbrando nota de cargo en version 4.0');
    this.dialogService
    .openConfirm({
      title: 'Comprobante fiscal digital',
      message: 'Timbrar la nota de cargo: ' + cargo.folio,
      cancelButton: 'Cancelar',
      acceptButton: 'Timbrar',
    })
    .afterClosed()
    .subscribe((res) => this.doTimbrarV4(cargo));
  }

  private doTimbrarV4(cargo: Partial<NotaDeCargo>) {
    this._loading$.next(true);
    this.service
      .timbrarV4(cargo.id)
      .pipe(finalize(() => this._loading$.next(false)))
      .subscribe(
        () => this.load(),
        (err) => this.onError(err)
      );
  }


  private doTimbrar(cargo: Partial<NotaDeCargo>) {
    this._loading$.next(true);
    this.service
      .timbrar(cargo.id)
      .pipe(finalize(() => this._loading$.next(false)))
      .subscribe(
        () => this.load(),
        (err) => this.onError(err)
      );
  }

  onDelete(cargo: Partial<NotaDeCargo>) {
    console.log('Eliminar: ', cargo);
  }

  onCancelar(
    cargo: Partial<NotaDeCargo>,
    event: { id: string; motivo: string }
  ) {
    console.log('Cancelar :', event);
    this.doCancelar(cargo, event.motivo);
  }

  doCancelar(cargo: Partial<NotaDeCargo>, motivo: string) {
    this._loading$.next(true);
    this.service
      .cancelar(cargo.id, motivo)
      .pipe(finalize(() => this._loading$.next(false)))
      .subscribe(
        () => {
          this.load();
          this.dialogService.openAlert({
            title: 'Cancelación de Cargo',
            message:
              'Cancelación de Nota exitosa. Cancelación del CFDI en proceso',
            closeButton: 'Cerrar',
          });
        },
        (err) => this.onError(err)
      );
  }

  mostrarCancelacionInfo(cargo: Partial<NotaDeCargo>) {
    if (cargo.cancelacion) {
      this.dialogService.openAlert({
        title: 'Cancelado por: ' + cargo.cancelacionUsuario,
        message: `Motivo: ${cargo.cancelacionMotivo}`,
        closeButton: 'Cerrar',
      });
    }
  }

  onError(error: any) {
    console.error('Error al actualizar Nota de cargo', error);
    const s_err =
      error.status === 404 ? `${error.message}` : `${error?.message?.message}`;
    this.dialogService.openAlert({
      title: 'Error actualizando Cargo',
      message: s_err,
      closeButton: 'Cerrar',
    });
  }
}
