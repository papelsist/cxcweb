import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nx-papelsa-credito-page',
  templateUrl: './credito-page.component.html',
  styleUrls: ['./credito-page.component.scss'],
})
export class CreditoPageComponent implements OnInit {
  features = [
    {
      path: 'devoluciones',
      label: 'Devoluciones',
      description: 'Notas de crédito por devolución',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
