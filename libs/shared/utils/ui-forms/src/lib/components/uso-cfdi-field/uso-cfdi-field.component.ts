import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'nx-papelsa-uso-cfdi',
  template: `
    <mat-form-field
      class="uso-field"
      [formGroup]="parent"
      [appearance]="apparence"
    >
      <mat-label>Uso de Cfdi</mat-label>
      <mat-select placeholder="Uso de Cfdi" [formControlName]="property">
        <mat-option *ngFor="let uso of usos" [value]="uso.clave">
          {{ uso.descripcion }}
        </mat-option>
      </mat-select>
      <mat-error>
        DEBE SELECCIONAR UN USO DE CFDI
      </mat-error>
    </mat-form-field>
  `,
  styles: [
    `
      .uso-field {
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsoCfdiFieldComponent implements OnInit {
  @Input() usos = [
    { clave: 'G01', descripcion: 'ADQUISICIÓN DE MERCANCIAS (G01)' },
    { clave: 'G03', descripcion: 'GASTOS EN GENERAL (G03)' },
    { clave: 'P01', descripcion: 'POR DEFINIR (P01)' },
  ];
  @Input() parent: FormGroup;
  @Input() property = 'usoDeCfdi';
  @Input() apparence: 'legacy' | 'standard' | 'fill' | 'outline' = 'standard';
  constructor() {}

  ngOnInit() {}
}
