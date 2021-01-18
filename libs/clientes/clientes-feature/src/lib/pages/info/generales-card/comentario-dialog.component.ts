import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClienteComentario } from '@nx-papelsa/shared/utils/core-models';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'nx-papelsa-comentario-dialog',
  template: `
    <div [formGroup]="form">
      <h3 mat-dialog-title>
        Comentario de cliente
      </h3>

      <div fxLayout="column" fxLayoutGap="5px">
        <mat-form-field>
          <textarea
            matInput
            formControlName="comentario"
            class="uppercase"
          ></textarea>
          <mat-error>
            <span *ngIf="comentario.hasError('minlength')">
              Longitud mínima 10 caracteres
            </span>
            <span *ngIf="comentario.hasError('maxlength')">
              Longitud máxima 50 caracteres
            </span>
            <span *ngIf="comentario.hasError('required')">
              Se requiere el comentario
            </span>
          </mat-error>
          <mat-hint align="end"
            >{{ form.get('comentario').value?.length || 0 }}/50</mat-hint
          >
        </mat-form-field>
        <mat-form-field>
          <mat-label>Tipo de comentario</mat-label>
          <mat-select placeholder="Tipo" formControlName="tipo">
            <mat-option *ngFor="let t of tipos" [value]="t.id">
              {{ t.id }} <small>({{ t.descripcion }})</small>
            </mat-option>
          </mat-select>
        </mat-form-field>
        <mat-checkbox formControlName="activo">Activo</mat-checkbox>
      </div>
      <mat-dialog-actions>
        <button mat-button mat-dialog-close>
          <mat-icon>cancel</mat-icon>
          <mat-label>Cancelar</mat-label>
        </button>
        <button
          mat-button
          color="primary"
          (click)="onSubmit()"
          [disabled]="form.invalid || form.pristine"
        >
          <mat-icon>save</mat-icon>
          <mat-label>Salvar</mat-label>
        </button>
      </mat-dialog-actions>
    </div>
  `,
})
export class ComentarioDialogComponent implements OnInit {
  form: FormGroup;
  target: ClienteComentario;
  apiUrl: string;
  tipos: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialotRef: MatDialogRef<ComentarioDialogComponent>,
    private fb: FormBuilder,
    private http: HttpClient,
    @Inject('apiUrl') api: string,
    private cd: ChangeDetectorRef
  ) {
    this.target = data.comentario;
    this.apiUrl = `${api}/clientes/tiposDeComentario`;
  }

  ngOnInit() {
    this.loadTipos();
    this.form = this.fb.group({
      comentario: [
        null,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(10),
        ],
      ],
      tipo: ['CREDITO', [Validators.required]],
      activo: [true, [Validators.required]],
    });
    if (this.target) {
      this.form.patchValue(this.target);
    }
  }

  loadTipos() {
    this.http
      .get<any[]>(this.apiUrl, {})
      .pipe(catchError((response: any) => throwError(response)))
      .subscribe((data) => {
        this.tipos = data;
        this.cd.detectChanges();
      });
  }

  onSubmit() {
    if (this.form.valid) {
      const value = {
        ...this.form.value,
        comentario: this.comentario.value.toUpperCase(),
      };
      if (this.target) value.id = this.target.id;
      this.dialotRef.close(value);
    }
  }

  get comentario() {
    return this.form.get('comentario');
  }
}
