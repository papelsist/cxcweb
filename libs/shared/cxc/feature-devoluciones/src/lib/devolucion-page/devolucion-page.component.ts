import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

import { Devolucion } from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'nx-papelsa-devolucion-page',
  templateUrl: './devolucion-page.component.html',
  styleUrls: ['./devolucion-page.component.scss'],
})
export class DevolucionPageComponent implements OnInit {
  devolucion$: Observable<Devolucion>;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    console.log('Route: ', this.route.snapshot.data);
    //this.devolucion$ = this.route.data.map()
    this.devolucion$ = this.route.data.pipe(pluck('devolucion'));
  }
}
