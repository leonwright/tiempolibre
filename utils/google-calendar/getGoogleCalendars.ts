import { calendar_v3 } from "googleapis";

export const getGoogleCalendars = async (token: string) => {
  return new calendar_v3.Resource$Calendarlist({
    _options: {
      headers: {
        authorization: "Bearer " + token,
      },
    },
  }).list();
};
