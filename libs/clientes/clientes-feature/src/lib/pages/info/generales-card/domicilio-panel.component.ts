import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Direccion } from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'nx-papelsa-domicilio-panel',
  template: `
    <mat-expansion-panel expanded>
      <mat-expansion-panel-header>
        <mat-panel-title>Domicilio fiscal</mat-panel-title>
        <mat-panel-description>
          <span fxFlex></span>
          <mat-icon>place</mat-icon>
        </mat-panel-description>
      </mat-expansion-panel-header>
      <address>
        <div class="address" fxLayout="column" fxLayoutGap="10px">
          <div fxFlex fxLayout fxLayoutAlign="start center" fxLayoutGap="5px">
            <span>Calle: {{ direccion.calle }}</span>
            <span>No Ext:{{ direccion.numeroExterior }}</span>
            <span *ngIf="direccion.numeroInterior">
              Interior: {{ direccion.numeroInterior }}</span
            >
          </div>

          <div>
            <span>Colonia: </span>
            <span>{{ direccion.colonia }}</span>
          </div>

          <div>
            <span>Municipio: </span>
            <span>{{ direccion.municipio }}</span>
          </div>

          <div>
            <span>CP: </span>
            <span>{{ direccion.codigoPostal }}</span>
          </div>
          <div fxLayout>
            <span>Estado: </span>
            <span>{{ direccion.estado }}</span>
            <span fxFlex></span>
            <span>Pais: </span>
            <span>{{ direccion.pais }}</span>
          </div>
        </div>
      </address>

      <mat-action-row>
        <button color="primary" mat-button (click)="modificar.emit(direccion)">
          <mat-icon>place</mat-icon>
          <span>Modificar</span>
        </button>
      </mat-action-row>
    </mat-expansion-panel>
  `,
  styles: [
    `
      .address {
        padding: 10px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DomicilioPanelComponent implements OnInit {
  @Input() direccion: Direccion;
  @Output() modificar = new EventEmitter<Direccion>();
  constructor() {}

  ngOnInit() {}
}
