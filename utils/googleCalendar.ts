import { Identity } from "auth0";
import { calendar_v3 } from "googleapis";
import moment from "moment";

// moment for the start of today
const today = moment().startOf("day");

export const getGoogleAuthenticationToken = (identities: Identity[]) => {
  // get object with connection name google-oauth2
  const googleIdentity = identities.find(
    (identity) => identity.connection === "google-oauth2"
  );

  return googleIdentity?.access_token;
};

export const getCalendars = async (token: string) => {
  return new calendar_v3.Resource$Calendarlist({
    _options: {
      headers: {
        authorization: "Bearer " + token,
      },
    },
  }).list();
};

// get single calendar
export const getCalendar = async (token: string, calendarId: string) => {
  return new calendar_v3.Resource$Events({
    _options: {
      headers: {
        authorization: "Bearer " + token,
      },
    },
  }).list({
    calendarId,
    orderBy: "startTime",
    singleEvents: true,
    timeMin: today.toISOString(),
  });
};

// create calendar event
export const createCalendarEvent = async (
  token: string,
  calendarId: string,
  event: calendar_v3.Schema$Event
) => {
  return new calendar_v3.Resource$Events({
    _options: {
      headers: {
        authorization: "Bearer " + token,
      },
    },
  }).insert({
    calendarId,
    requestBody: {
      eventType: "regular",
      summary: event.summary,
    },
  });
};
