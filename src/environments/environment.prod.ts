import { KeycloakConfig } from "keycloak-js";


const keycloakConfig: KeycloakConfig = {
  url: 'https://sso-poc.quito.gob.ec:8443/auth/',
  realm: 'Municipales',
  clientId: 'angular-artes',
};

export const environment = {
  production: true,
  url: "http://172.22.4.106:4300",
  base_url: "http://172.22.4.106:5050/api",
  url_wso2: "https://sso-poc.quito.gob.ec:9443",

  keycloakConfig,
  redirectUrl: 'http://172.22.4.106:4300/dashboard',
  redirectUri: 'http://172.22.4.106:4300/dashboard',
};
