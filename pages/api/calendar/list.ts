import {
  withApiAuthRequired,
  getSession,
  getAccessToken,
} from "@auth0/nextjs-auth0";
import { ManagementClient } from "auth0";
import { googleCalendar } from "../../../utils";

const management = new ManagementClient({
  domain: "tiempolibre.us.auth0.com",
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  scope: "read:users update:users",
});

export default withApiAuthRequired(async function ProtectedRoute(req, res) {
  const session = getSession(req, res);
  const accessToken = getAccessToken(req, res);
  const userInfo = await management.getUser({ id: session!.user.sub });

  const calendars = await googleCalendar.getGoogleCalendars(
    googleCalendar.getGoogleAuthenticationToken(userInfo.identities!)!
  );

  res.json(
    calendars.data.items?.map((calendar) => {
      return {
        primary: calendar.primary || false,
        name: calendar.summary,
        id: calendar.id,
      };
    })
  );
});
