import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { NotaDeCargoCreateDto } from '@nx-papelsa/shared/utils/core-models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'nx-papelsa-create-cargo',
  templateUrl: './create-cargo.component.html',
  styleUrls: ['./create-cargo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCargoComponent implements OnInit {
  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<CreateCargoComponent, NotaDeCargoCreateDto>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      cartera: ['CRE', [Validators.required]],
      comentario: [],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const { cartera, comentario } = this.form.value;
      this.dialogRef.close({ cartera, comentario });
    }
  }
}
