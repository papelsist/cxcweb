import { Component, Input, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Cobrador } from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'nx-papelsa-cobrador-field',
  template: `
    <ng-container [formGroup]="parent">
      <mat-form-field [style.width.%]="100" [appearance]="apparence">
        <mat-select
          [placeholder]="placeholder"
          [formControlName]="property"
          class="sucursal-field"
        >
          <mat-option></mat-option>
          <mat-option
            *ngFor="let cobrador of cobradores$ | async"
            [value]="cobrador"
          >
            {{ cobrador.nombres }} ({{ cobrador.sw2 }})
          </mat-option>
        </mat-select>
      </mat-form-field>
    </ng-container>
  `,
  styles: [],
})
export class CobradorFieldComponent implements OnInit {
  @Input() parent: FormGroup;

  apiUrl: string;

  @Input() property = 'cobrador';

  @Input() placeholder = 'Cobrador';
  @Input() apparence: 'legacy' | 'standard' | 'fill' | 'outline' = 'fill';

  cobradores$: Observable<Cobrador[]>;

  // constructor(private http: HttpClient, private config: ConfigService) {
  //   this.apiUrl = config.buildApiUrl('cobradores');
  // }

  constructor(private http: HttpClient, @Inject('apiUrl') api) {
    this.apiUrl = `${api}/cobradores`;
  }

  ngOnInit() {
    this.cobradores$ = this.http.get<Cobrador[]>(this.apiUrl);
  }
}
