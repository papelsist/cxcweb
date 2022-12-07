import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Input,
    Output,
    EventEmitter,
  } from '@angular/core';

  @Component({
    selector: 'nx-papelsa-cfdi-timbrarv4',
    template: `
      <button
      mat-button
      type="button"
      (click)="timbrarV4.emit()"
      [color]="color"
      [disabled]="disabled"
    >
      <mat-icon>cast</mat-icon>
      <span>Timbrar V4</span>
    </button>
    `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class CfdiTimbrarV4Component implements OnInit {
    @Input() color = 'default';
    @Input() disabled = false;
    @Output() timbrarV4 = new EventEmitter();
    loading = false;
  
    constructor() {}
  
    ngOnInit(): void {}
  }