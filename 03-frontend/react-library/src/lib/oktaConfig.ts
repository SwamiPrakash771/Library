export const oktaConfig = {
  clientId: "0oanpi82ob7OHBFp85d7",
  issuer: "https://dev-25288943.okta.com/oauth2/default",
  redirectUri: "https://localhost:3000/login/callback",
  scopes: ["openid", "profile", "email"],
  pkce: true,
  useClassicEngine: true,
  disableHttpsCheck: true,
};
