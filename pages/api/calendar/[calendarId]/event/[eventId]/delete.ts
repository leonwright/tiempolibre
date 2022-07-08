import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { ManagementClient } from "auth0";
import { googleCalendar } from "../../../../../../utils";

const management = new ManagementClient({
  domain: "tiempolibre.us.auth0.com",
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  scope: "read:users update:users",
});

export default withApiAuthRequired(async function ProtectedRoute(req, res) {
  if (req.method !== "DELETE") {
    res.status(405).send({ message: "Only DELETE requests allowed" });
    return;
  }
  console.log(req.query);
  const session = getSession(req, res);
  const userInfo = await management.getUser({ id: session!.user.sub });

  await googleCalendar.deleteGoogleCalendarEvent(
    googleCalendar.getGoogleAuthenticationToken(userInfo.identities!)!,
    req.query.calendarId as string,
    req.query.eventId as string
  );

  res.json({ message: "Event deleted" });
});
