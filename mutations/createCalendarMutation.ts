import { useMutation } from "react-query";

// create calendar mutation
export const useCreateCalendarMutation = () => {
  const createCalendarMutation = (calendar: any) => {
    // post to /api/events/create
    return fetch(`/api/event/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(calendar),
    });
  };
  return useMutation(createCalendarMutation, {
    onSuccess: () => {
      console.log("Calendar created");
    },
  });
};
