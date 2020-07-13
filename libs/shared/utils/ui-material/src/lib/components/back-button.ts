import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'nx-papelsa-back-button',
  template: `
    <button mat-button (click)="back()">
      <mat-icon>arrow_back</mat-icon>
      <span>Regresar</span>
    </button>
  `,
})
export class BackButtonComponent implements OnInit {
  constructor(private location: Location) {}

  ngOnInit(): void {}

  back() {
    this.location.back();
  }
}
