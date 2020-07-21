import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { CfdiService } from '@nx-papelsa/shared/cfdi/data-access';
import { Cfdi } from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'nx-papelsa-cfdi-xml',
  template: `
    <ng-container *ngIf="type === 'raised'">
      <button mat-raised-button type="button" (click)="mostrarXml()">
        <mat-icon>dvr</mat-icon> Ver XML
      </button>
    </ng-container>

    <ng-container *ngIf="type === 'flat'">
      <button mat-flat-button type="button" (click)="mostrarXml()">
        <mat-icon>dvr</mat-icon> Ver XML
      </button>
    </ng-container>

    <ng-container *ngIf="type === 'stroked'">
      <button mat-stroked-button type="button" (click)="mostrarXml()">
        <mat-icon>dvr</mat-icon> Ver XML
      </button>
    </ng-container>

    <ng-container *ngIf="type === 'default'">
      <button mat-button type="button" (click)="mostrarXml()">
        <mat-icon>dvr</mat-icon> Ver XML
      </button>
    </ng-container>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CfdiXmlComponent implements OnInit {
  @Input() cfdi: Partial<Cfdi>;
  @Input() color = 'default';
  @Input() type: 'raised' | 'flat' | 'stroked' | 'default' = 'default';

  constructor(private service: CfdiService) {}

  ngOnInit(): void {}

  mostrarXml() {
    this.service.mostrarXml(this.cfdi);
  }
}
