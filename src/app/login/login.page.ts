import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private loginServise: LoginService, private router: Router) { }

  ngOnInit() {
  }
  onLogin() {
    this.loginServise.login();
    this.router.navigateByUrl('/events/tabs/discover');

  }

}
