import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Cliente } from '@nx-papelsa/shared/utils/core-models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'nx-papelsa-cliente-info',
  templateUrl: './cliente-info.component.html',
  styleUrls: ['./cliente-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClienteInfoComponent implements OnInit {
  public form: FormGroup = this.fb.group({
    rfc: [null, Validators.required],
    nombre: [
      null,
      [Validators.required, Validators.minLength(5), Validators.maxLength(255)],
    ],
  });
  private _cliente: Cliente;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {}

  @Input()
  set cliente(value: Cliente) {
    this._cliente = value;
  }
  get cliente() {
    return this._cliente;
  }
}
