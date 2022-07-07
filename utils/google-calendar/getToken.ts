import { Identity } from "auth0";

export const getGoogleAuthenticationToken = (identities: Identity[]) => {
  // get object with connection name google-oauth2
  const googleIdentity = identities.find(
    (identity) => identity.connection === "google-oauth2"
  );

  return googleIdentity?.access_token;
};
