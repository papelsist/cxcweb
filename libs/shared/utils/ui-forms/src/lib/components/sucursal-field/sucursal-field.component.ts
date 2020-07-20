import { Component, Input, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

import { Sucursal } from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'nx-papelsa-sucursal-field',
  template: `
    <ng-container [formGroup]="parent">
      <mat-form-field [style.width.%]="100">
        <mat-select
          [placeholder]="placeholder"
          [formControlName]="sucursalProperty"
          class="sucursal-field"
        >
          <mat-option>Todas</mat-option>
          <mat-option *ngFor="let sucursal of sucursales" [value]="sucursal">
            {{ sucursal.nombre }}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </ng-container>
  `,
})
export class SucursalFieldComponent implements OnInit, OnDestroy {
  apiUrl: string;

  @Input() parent: FormGroup;

  @Input() sucursalProperty = 'sucursal';

  @Input() placeholder = 'Sucursal';

  sucursales: Sucursal[];

  private subscription: Subscription;

  constructor(private http: HttpClient, @Inject('apiUrl') api) {
    this.apiUrl = `${api}/sucursales`;
  }

  ngOnInit() {
    this.subscription = this.buscarSucursales().subscribe(
      (sucursales) => (this.sucursales = sucursales)
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  buscarSucursales(): Observable<Sucursal[]> {
    return this.http.get<Sucursal[]>(this.apiUrl, {
      params: new HttpParams().set('activas', 'activas'),
    });
  }
}
