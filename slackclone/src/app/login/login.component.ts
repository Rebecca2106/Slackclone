import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FireauthService } from 'src/services/fireauth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent{
  hide = true;
  loginForm = new FormGroup({
  email: new FormControl('', [Validators.required, Validators.email]),
  pwd: new FormControl('', [Validators.required])
  });

  constructor(public fs: FireauthService) { }

  getErrorMessage() {
    if (this.loginForm.get('email').hasError('required')) {
      return 'You must enter a registered email address!';
    }

    return this.loginForm.get('email').hasError('email') ? 'Not a valid email.' : '';
  }

}
