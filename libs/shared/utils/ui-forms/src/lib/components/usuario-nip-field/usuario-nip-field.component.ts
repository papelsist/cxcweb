import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewContainerRef,
  Inject,
} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { User } from '@nx-papelsa/shared/utils/core-models';
import { TdDialogService } from '@covalent/core/dialogs';

@Component({
  selector: 'nx-papelsa-usuario-nip-field',
  template: `
    <mat-form-field fxFlex>
      <mat-label>Clave de autorización</mat-label>
      <input
        type="password"
        matInput
        (keydown.enter)="search(input.value)"
        [disabled]="disabled"
        #input
      />

      <mat-error>
        Imposible autorizar operación
      </mat-error>
    </mat-form-field>
  `,
  styles: ['.fill { width: 100%; }'],
})
export class UsuarioNipFieldComponent implements OnInit {
  apiUrl: string;

  @Input() placeholder = 'Contraseña';

  @Input() disabled = false;

  @Output() usuarioFound = new EventEmitter<User>();

  constructor(
    private http: HttpClient,
    @Inject('apiUrl') api,
    private _dialogService: TdDialogService,
    private _viewContainerRef: ViewContainerRef
  ) {
    this.apiUrl = `${api}/users`;
  }

  ngOnInit() {}

  search(val) {
    const url = `${this.apiUrl}/buscarPorNip`;
    const params = new HttpParams().set('nip', val);
    return this.http
      .get<User>(url, { params: params })
      .subscribe(
        (res) => {
          this.usuarioFound.emit(res);
        },
        (error2) => {
          this.handleError(error2);
        }
      );
  }

  handleError(error) {
    // window.alert('No permitido para autorizar');
    this._dialogService.openAlert({
      title: 'Autorización fallida',
      message: ' Clave o credenciales insuficientes',
      disableClose: true,
      viewContainerRef: this._viewContainerRef,
      closeButton: 'Cerrar',
    });
  }
}
