import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
  Inject,
} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Direccion } from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'nx-papelsa-direccion-form',
  templateUrl: './direccion-form.component.html',
  styleUrls: ['./direccion-form.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DireccionFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  destroy$ = new Subject();
  apiUrl: string;
  @Input() colonias = [];
  @Input() direccion: Direccion;

  constructor(
    private http: HttpClient,
    @Inject('apiUrl') api,
    private fb: FormBuilder
  ) {
    this.apiUrl = `${api}/zip`;
  }

  ngOnInit() {
    if (this.direccion) {
      this.actualizarColonias(this.direccion.codigoPostal);
      // this.colonias.push(this.direccion.colonia);
    }
    this.form = this.buildForm(this.direccion);
    this.form
      .get('codigoPostal')
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        filter((term) => !!term)
      )
      .subscribe((zip) => this.actualizarCodigoPostal(zip));

    // const colonia = this.form.get('colonia').value;
    // this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((val) => {
    //   if (colonia && this.colonias.length === 0) {
    //     this.colonias.push(colonia);
    //   }
    // });
  }

  private buildForm(direccion?: Direccion): FormGroup {
    const form = this.fb.group({
      calle: [null, [Validators.required]],
      numeroExterior: [null, [Validators.required]],
      numeroInterior: [null, [Validators.required]],
      codigoPostal: [
        null,
        { validators: [Validators.required], updateOn: 'blur' },
      ],
      colonia: [null, [Validators.required]],
      municipio: [null, [Validators.required]],
      estado: [null, [Validators.required]],
      pais: ['MEXICO', [Validators.required]],
    });
    if (direccion) {
      form.patchValue(direccion);
    }
    return form;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  actualizarCodigoPostal(zip: string) {
    const params = new HttpParams().set('zip', zip);
    this.http
      .get(this.apiUrl, {
        params: params,
      })
      .subscribe(
        (registros: any) => {
          if (registros.codigoPostal) {
            this.colonias = registros.colonias.ma((item) => item.toUpperCase());
            this.update(registros);
          }
        },
        (response) => console.log('Http Error: ', response)
      );
  }

  private actualizarColonias(zip: string) {
    const params = new HttpParams().set('zip', zip);
    this.http
      .get(this.apiUrl, {
        params: params,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (registros: any) => {
          if (registros.codigoPostal) {
            this.colonias = registros.colonias.map((item) =>
              item.toUpperCase()
            );
          }
        },
        (response) => console.log('Http Error: ', response)
      );
  }

  private update(zipData: any) {
    const { estado, municipio, pais, colonias } = zipData;
    this.form.patchValue({ estado, municipio, pais });
  }

  compareWith(item1: string, item2: string): boolean {
    // console.log('Comparando: ',)
    return item1 && item2 ? item1.toLowerCase() === item2.toLowerCase() : false;
  }
}
