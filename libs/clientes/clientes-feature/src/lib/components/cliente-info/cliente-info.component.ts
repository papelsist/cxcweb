import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Cliente } from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'nx-papelsa-cliente-info',
  templateUrl: './cliente-info.component.html',
  styleUrls: ['./cliente-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClienteInfoComponent implements OnInit {
  @Input() cliente: Cliente;
  constructor() {}

  ngOnInit() {}
}
