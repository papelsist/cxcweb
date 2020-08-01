import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Cobro } from '@nx-papelsa/shared/utils/core-models';
import { CobrosFacade } from '@nx-papelsa/shared/cxc/data-access-cobros';

@Component({
  selector: 'nx-papelsa-cobro-page',
  templateUrl: './cobro-page.component.html',
  styleUrls: ['./cobro-page.component.scss'],
})
export class CobroPageComponent implements OnInit {
  cobro$ = this.facade.selectedCobros$;

  constructor(private facade: CobrosFacade) {}

  ngOnInit(): void {}
}
