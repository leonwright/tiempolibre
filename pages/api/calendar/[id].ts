import {
  getAccessToken,
  getSession,
  withApiAuthRequired,
} from "@auth0/nextjs-auth0";
import { ManagementClient } from "auth0";
import {
  getCalendar,
  getGoogleAuthenticationToken,
} from "../../../utils/googleCalendar";

const management = new ManagementClient({
  domain: "tiempolibre.us.auth0.com",
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  scope: "read:users update:users",
});

export default withApiAuthRequired(async function ProtectedRoute(req, res) {
  const session = getSession(req, res);
  const userInfo = await management.getUser({ id: session!.user.sub });

  const calendar = await getCalendar(
    getGoogleAuthenticationToken(userInfo.identities!)!,
    req.query.id as string
  );

  res.json(
    calendar.data.items?.map((event) => {
      return {
        title: event.summary,
        start: event.start?.dateTime,
        end: event.end?.dateTime,
        description: event.description,
      };
    })
  );
});
