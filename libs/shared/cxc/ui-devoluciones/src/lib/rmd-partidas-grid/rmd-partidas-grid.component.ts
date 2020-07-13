import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

@Component({
  selector: 'nx-papelsa-rmd-partidas-grid',
  templateUrl: './rmd-partidas-grid.component.html',
  styleUrls: ['./rmd-partidas-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RmdPartidasGridComponent implements OnInit {
  @Input() partidas: any[];
  constructor() {}

  ngOnInit(): void {}
}
