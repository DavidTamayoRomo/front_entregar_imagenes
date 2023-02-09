import { Component, OnInit } from '@angular/core';
import { KeycloakAuthService } from '../keycloak-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {

  constructor(
    private keycloakAuthService: KeycloakAuthService
  ) { }

  ngOnInit(): void {
  }

  login(): void {
    this.keycloakAuthService.login();
  }

}
