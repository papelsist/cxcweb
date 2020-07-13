import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { DevolucionesService } from '@nx-papelsa/shared/cxc/data-acces';
import { DevolucionDto } from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'nx-papelsa-devoluciones-page',
  templateUrl: './devoluciones-page.component.html',
  styleUrls: ['./devoluciones-page.component.scss'],
})
export class DevolucionesPageComponent implements OnInit {
  devoluciones$: Observable<DevolucionDto[]>;

  constructor(private service: DevolucionesService, private router: Router) {}

  ngOnInit(): void {
    this.reload();
  }

  reload() {
    this.devoluciones$ = this.service.list();
  }
  showInfo(dto: DevolucionDto) {
    console.log('DTO: ', dto.id);
    this.router.navigate(['credito', 'devoluciones', 'show', dto.id]);
  }
}
