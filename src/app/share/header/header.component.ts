import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  public persona: any;
  constructor(
    private keycloakService: KeycloakService
  ) { }

  ngOnInit(): void {
    this.persona = this.getLoggedUser();
  }

  logout() {
    this.keycloakService.logout();
  }

  getLoggedUser() {
    try {
      let userDetails = this.keycloakService.getKeycloakInstance().idTokenParsed;
      console.log('DETALLE USUARIO',userDetails);
      return userDetails;
    } catch (e) {
      console.log('getLoggedUser Exception', e);
      return undefined;
    }
  }

}
