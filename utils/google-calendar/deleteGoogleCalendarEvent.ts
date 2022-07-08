import { calendar_v3 } from "googleapis";
import moment from "moment";

export const deleteGoogleCalendarEvent = async (
  token: string,
  calendarId: string,
  eventId: string
) => {
  return new calendar_v3.Resource$Events({
    _options: {
      headers: {
        authorization: "Bearer " + token,
      },
    },
  }).delete({
    calendarId,
    eventId,
  });
};
