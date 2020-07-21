import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { CfdiService } from '@nx-papelsa/shared/cfdi/data-access';
import { Cfdi } from '@nx-papelsa/shared/utils/core-models';
import { TdLoadingService } from '@covalent/core/loading';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'nx-papelsa-cfdi-pdf',
  template: `
    <button mat-button type="button" (click)="imprimir()">
      <mat-icon>picture_as_pdf</mat-icon>
      <span>Imprimir CFDI</span>
    </button>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CfdiPdfComponent implements OnInit {
  @Input() cfdi: Partial<Cfdi>;
  @Input() color = 'default';
  loading = false;

  constructor(
    private service: CfdiService,
    private loadingService: TdLoadingService
  ) {}

  ngOnInit(): void {}

  imprimir() {
    this.loadingService.register();
    this.service
      .printCfdi(this.cfdi)
      .pipe(finalize(() => this.loadingService.resolve()))
      .subscribe((res) => {
        const blob = new Blob([res], {
          type: 'application/pdf',
        });
        const fileURL = window.URL.createObjectURL(blob);
        window.open(fileURL, '_blank');
      });
  }
}
