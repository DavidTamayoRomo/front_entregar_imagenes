import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { KeycloakService, KeycloakAuthGuard } from 'keycloak-angular';
import Swal from 'sweetalert2';
import { KeycloakAuthService } from './keycloak-auth.service';

@Injectable()
export class KeycloakGuard extends KeycloakAuthGuard {
  constructor(
    protected override router: Router,
    protected override keycloakAngular: KeycloakService,
    private keycloakAuthService: KeycloakAuthService) {
    super(router, keycloakAngular);
  }

  isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    return new Promise(async (resolve, reject) => {

      if (!this.authenticated) {
        this.router.navigate(['/login']);
        resolve(false);
        return;
      }
      this.roles = this.keycloakAuthService.getRoles();
      if (this.roles.length > 0) {
        console.log('ROLES ',this.roles);
        const requiredRoles = route.data['roles'];
        let granted: boolean = false;
        if (!requiredRoles || requiredRoles.length === 0) {
          granted = true;
        } else {
          for (const requiredRole of requiredRoles) {
            if (this.roles.indexOf(requiredRole) > -1) {
              granted = true;
              break;
            }
          }
        }

        if (granted === false) {
          Swal.fire({
            title: '<strong>Sin permiso</strong>',
            icon: 'info',
            html: `No tiene acceso a este módulo`,
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: 'Aceptar'
          }) 
          this.router.navigate(['']);
          resolve(granted);
        }
        resolve(granted);
      } else {
        this.keycloakAuthService.logout();
        Swal.fire({
          title: '<strong>Notificación</strong>',
          icon: 'info',
          html: `El usuario no contiene ningún rol`,
          showCloseButton: true,
          focusConfirm: false,
          confirmButtonText: 'Aceptar'
        }).then((result)=>{
          if (result.isConfirmed) {
            this.keycloakAuthService.logout()
          }
        })

      }

    });
  }
}