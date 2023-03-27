import { KeycloakConfig } from "keycloak-js";


const keycloakConfig: KeycloakConfig = {
  url: 'https://sso-poc.quito.gob.ec:8443/auth/',
  realm: 'Municipales',
  clientId: 'angular-artes',
};

export const environment = {
  production: true,
  url: "https://sso-poc.quito.gob.ec:4943",
  base_url: "https://sso-poc.quito.gob.ec:5043/api",
  url_wso2: "https://sso-poc.quito.gob.ec:9443",

  keycloakConfig,
  redirectUrl: 'https://sso-poc.quito.gob.ec:4943/dashboard',
  redirectUri: 'https://sso-poc.quito.gob.ec:4943/dashboard',
};
