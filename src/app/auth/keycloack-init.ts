import { KeycloakService, KeycloakOptions } from 'keycloak-angular';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
/* import Swal from 'sweetalert2' */

export function initializeKeycloak(keycloak: KeycloakService): () => Promise<any> {
  /* return (): Promise<any> => {
    return new Promise(async (res, rej) => {
      try {
        await keycloak.init({
          config: environment.keycloakConfig,
          initOptions: {
            onLoad: 'check-sso',
            //redirectUri: environment.redirectUri,
          },
          loadUserProfileAtStartUp: true,
        });
        res('');
      } catch (error) {
        Swal.fire({
                    title: 'Error!',
                    text: 'Error de conexión con Keycloack',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                  })
      }
    });
  }; */

  const options: KeycloakOptions = {
    config: environment.keycloakConfig,
    initOptions: {
      onLoad: 'check-sso',
      //redirectUri: environment.redirectUri,
      checkLoginIframe: false,
    },
    //loadUserProfileAtStartUp: true,
  };
  return () => keycloak.init(options); 
}
