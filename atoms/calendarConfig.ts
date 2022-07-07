import { atom } from "recoil";

export const selectedCalendarState = atom({
  key: "selectedCalendar", // unique ID (with respect to other atoms/selectors)
  default: {
    id: "",
    name: "",
  }, // default value (aka initial value)
});
