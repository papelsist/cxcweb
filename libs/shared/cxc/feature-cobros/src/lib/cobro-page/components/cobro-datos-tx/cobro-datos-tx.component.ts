import { Component, OnInit, Input } from '@angular/core';
import { PropertyItem, Cobro } from '@nx-papelsa/shared/utils/core-models';

import { FormatService } from '@nx-papelsa/shared/utils/ui-common';
import { capitalize } from '@nx-papelsa/shared/utils/collections';

@Component({
  selector: 'nx-papelsa-cxc-cobro-datos-tx',
  template: `
  <div class="datos-panel">
    <mat-form-field fxFlex>
        <input
          type="text"
          matInput
          placeholder="Cadena Original"
        />
    </mat-form-field>
    <mat-form-field fxFlex>
        <input
          type="text"
          matInput
          placeholder="Sello"
        />
    </mat-form-field>
    <mat-form-field fxFlex>
        <input
          type="text"
          matInput
          placeholder="Certificado"  
        />
    </mat-form-field>
  </div>
  
  `,
  styles:[]
})

export class CobroDatosTxComponent implements OnInit {
    @Input() cobro: Partial<Cobro>;

  constructor(private service: FormatService) {
      console.log("Cargando el cobro  hheeeee!!!");
  }

  ngOnInit() {
      console.log("Inicializando el cobro en Ui !!!");
  }

  getValue(item: PropertyItem, entity: any) {
 
  }
  capitalize(s: string) {
   
  }
}
