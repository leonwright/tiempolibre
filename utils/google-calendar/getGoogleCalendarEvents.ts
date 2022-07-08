import { calendar_v3 } from "googleapis";
import moment from "moment";

export const getGoogleCalendarEvents = async (
  token: string,
  calendarId: string
) => {
  const today = moment().startOf("day");

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
