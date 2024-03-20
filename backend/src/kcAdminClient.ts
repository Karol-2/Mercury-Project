import KeycloakAdminClient from "@keycloak/keycloak-admin-client";

const kcAdminClient = new KeycloakAdminClient({
  baseUrl: "http://localhost:3000",
  realmName: "mercury",
});

async function authAdminClient() {
  try {
    await kcAdminClient.auth({
      grantType: "client_credentials",
      clientId: "mercury-backend",
      clientSecret: process.env.CLIENT_SECRET,
    });
  } catch (e: any) {
    if (!e || !e.cause) {
      throw e;
    }

    if (["address", "port", "code"].every((key) => key in e.cause)) {
      const { address, port, code } = e.cause;
      console.log("Can't connect to Keycloak: ", { address, port, code });
    } else {
      console.error("Can't connect to Keycloak:", e);
    }
  }
}

await authAdminClient();
setInterval(() => authAdminClient(), 58 * 1000);

export default kcAdminClient;
