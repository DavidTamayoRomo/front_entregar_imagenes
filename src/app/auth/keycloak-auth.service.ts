import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakLoginOptions } from 'keycloak-js';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class KeycloakAuthService {
  keycloakLoginOptions: KeycloakLoginOptions = {
    redirectUri: environment.redirectUri,
  };
  constructor(
    private keycloakService: KeycloakService,
    private route: Router
  ) {}

  getLoggedUser() {
    try {
      let userDetails =
        this.keycloakService.getKeycloakInstance().idTokenParsed;
      return userDetails;
    } catch (e) {
      return undefined;
    }
  }

  logout() {
    localStorage.clear();
    this.keycloakService.logout();
  }
  login() {
    this.keycloakService.login(this.keycloakLoginOptions);
    this.keycloakService.updateToken(180);
  }
  redirectToProfile() {
    this.keycloakService.getKeycloakInstance().accountManagement();
  }
  getRoles() {
    let roles = this.keycloakService.getKeycloakInstance().resourceAccess;
    if (roles![environment.keycloakConfig.clientId]) {
      return roles![environment.keycloakConfig.clientId].roles;
    }
    return [];
  }
  redirectToMenu() {
    if (this.keycloakService.getKeycloakInstance().authenticated) {
      this.route.navigate(['/pages']);
    }
  }
  public isLoggedIn(): Promise<boolean> {
    return this.keycloakService.isLoggedIn();
  }

  IsAuthenticated() {
    return this.keycloakService.getKeycloakInstance().authenticated;
  }
  getToken() {
    return this.keycloakService.getToken();
  }
}
