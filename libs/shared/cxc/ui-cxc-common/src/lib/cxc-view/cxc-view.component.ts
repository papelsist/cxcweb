import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CuentaPorCobrar } from '@nx-papelsa/shared/utils/core-models';
import {
  BaseComponent,
  FormatService,
} from '@nx-papelsa/shared/utils/ui-common';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'nx-papelsa-cxc-view',
  template: ` <nx-papelsa-cxc-panel [cxc]="cxc"></nx-papelsa-cxc-panel> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CxcViewComponent extends BaseComponent implements OnInit {
  cxc: CuentaPorCobrar;

  constructor(private route: ActivatedRoute, private service: FormatService) {
    super();
  }

  ngOnInit(): void {
    this.route.data
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ cxc }) => (this.cxc = cxc));
  }
}
