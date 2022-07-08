import { calendar_v3 } from "googleapis";
import moment from "moment";

export const createGoogleCalendarEvent = async (
  token: string,
  calendarId: string,
  event: any
) => {
  console.log(event);
  const createdEvent = await new calendar_v3.Resource$Events({
    _options: {
      headers: {
        authorization: "Bearer " + token,
      },
    },
  }).insert({
    calendarId,
    requestBody: {
      summary: event.title,
      description: event.description,
      start: {
        dateTime: moment(event.date).format(),
        timeZone: "America/Jamaica",
      },
      end: {
        dateTime: moment(event.date)
          .add(event.duration, event.durationUnit)
          .format(),
        timeZone: "America/Jamaica",
      },
      eventType: "default",
    },
  });

  console.log(createdEvent.data);

  return createdEvent.data;
};
