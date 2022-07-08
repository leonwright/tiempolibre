import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { useMutation } from "react-query";
import { v4 as uuid } from "uuid";
import { firestore } from "../firebase/clientApp";

// create calendar mutation
export const useDeleteCalendarMutation = () => {
  const deleteCalendarMutation = (event: any) => {
    console.log(event);
    // post to /api/events/create
    return fetch(
      `/api/calendar/${event.externalCalendarId}/event/${event.eventId}/delete`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };
  return useMutation(deleteCalendarMutation, {
    onSuccess: async (data, variables, context) => {
      console.log("Calendar deleted");
      console.log(variables);
      const collectionPath = `users/${variables.createdBy}/events`;
      try {
        await deleteDoc(doc(firestore, collectionPath, variables.id));
      } catch (e) {
        console.log(e);
      }
    },
  });
};
