import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthFacade } from '../../+state/auth.facade';
import { Authenticate } from '../../+state/auth.entities';

@Component({
  selector: 'nx-papelsa-login',
  templateUrl: './login.page.component.html',
  styleUrls: ['./login.page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  loading$ = this.facade.loading$;
  error$ = this.facade.error$;
  form: FormGroup;

  constructor(private facade: AuthFacade, private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      username: [null, [Validators.required, Validators.minLength(4)]],
      password: [null, [Validators.required, Validators.minLength(4)]],
    });
  }

  login() {
    if (this.form.valid) {
      const { username, password } = this.form.value;
      this.facade.login(username, password);
    }
  }
}
