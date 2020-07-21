import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'nx-papelsa-cfdi-timbrar',
  template: `
    <button
      mat-button
      type="button"
      (click)="timbrar.emit()"
      [color]="color"
      [disabled]="disabled"
    >
      <mat-icon>cast</mat-icon>
      <span>Timbrar</span>
    </button>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CfdiTimbrarComponent implements OnInit {
  @Input() color = 'default';
  @Input() disabled = false;
  @Output() timbrar = new EventEmitter();
  loading = false;

  constructor() {}

  ngOnInit(): void {}
}
