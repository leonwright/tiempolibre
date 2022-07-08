import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { ManagementClient } from "auth0";
import { createGoogleCalendarEvent } from "../../../../../utils/google-calendar/createGoogleCalendarEvent";
import { googleCalendar } from "../../../../../utils";

const management = new ManagementClient({
  domain: "tiempolibre.us.auth0.com",
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  scope: "read:users update:users",
});

export default withApiAuthRequired(async function ProtectedRoute(req, res) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }
  const session = getSession(req, res);
  const userInfo = await management.getUser({ id: session!.user.sub });

  const googleEvent = await googleCalendar.createGoogleCalendarEvent(
    googleCalendar.getGoogleAuthenticationToken(userInfo.identities!)!,
    req.query.calendarId as string,
    req.body
  );

  res.json(googleEvent);
});
