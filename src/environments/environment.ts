// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { KeycloakConfig } from "keycloak-js";


const keycloakConfig: KeycloakConfig = {
  url: 'https://sso-poc.quito.gob.ec:8443/auth/',
  realm: 'Municipales',
  clientId: 'angular-artes',
};

export const environment = {
  production: false,
  url: "http://localhost:4200",
  base_url: "http://localhost:5050/api",
  url_wso2: "https://sso-poc.quito.gob.ec:9443",

  keycloakConfig,
  redirectUrl: 'http://localhost:4200/dashboard',
  redirectUri: 'http://localhost:4200/dashboard',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
