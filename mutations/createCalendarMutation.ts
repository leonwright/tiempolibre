import { collection, doc, setDoc } from "firebase/firestore";
import { useMutation } from "react-query";
import { v4 as uuid } from "uuid";
import { firestore } from "../firebase/clientApp";

// create calendar mutation
export const useCreateCalendarMutation = () => {
  const createCalendarMutation = (calendar: any) => {
    console.log(calendar);
    // post to /api/events/create
    return fetch(`/api/calendar/${calendar.externalCalendarId}/event/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(calendar),
    });
  };
  return useMutation(createCalendarMutation, {
    onSuccess: async (data, variables, context) => {
      console.log("Calendar created");
      const apiResp = await data.json();
      const eventId = uuid();
      const collectionPath = `users/${variables.createdBy}/events`;
      const col = collection(firestore, collectionPath);
      const eventRef = doc(firestore, col.path, eventId);
      variables = {
        ...variables,
        eventId: apiResp.id,
      };
      await setDoc(eventRef, variables, {
        merge: true,
      });
    },
  });
};
