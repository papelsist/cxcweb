import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { CfdiService } from '@nx-papelsa/shared/cfdi/data-access';
import { Cfdi } from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'nx-papelsa-cfdi-cancel-xml',
  template: `
    <button
      mat-button
      td-message-actions
      type="button"
      (click)="mostrarAcuseXml()"
      color="accent"
    >
      <mat-icon>report_off</mat-icon>
      <span>{{ title }}</span>
    </button>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CfdiCancelXmlComponent implements OnInit {
  @Input() cfdi: Partial<Cfdi>;
  @Input() color = 'default';
  @Input() title = 'Acuse de cancelación';

  constructor(private service: CfdiService) {}

  ngOnInit(): void {}

  mostrarAcuseXml() {
    this.service.mostrarCancelacionXml(this.cfdi);
  }
}
