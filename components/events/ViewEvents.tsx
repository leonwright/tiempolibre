import { useUser } from "@auth0/nextjs-auth0";
import { collection, deleteDoc, doc } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { firestore } from "../../firebase/clientApp";
import moment from "moment";
import { AppEvent, EventRow } from "./EventRow";
import { useDeleteCalendarMutation } from "../../mutations/deleteCalendarMutation";

export const ViewEvents = () => {
  const { user, error, isLoading } = useUser();
  const userId = user?.sub as string;

  const [events, eventsLoading, eventsError] = useCollection(
    collection(firestore, `users/${user?.sub}/events`),
    {}
  );

  const eventList: AppEvent[] = events?.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  }) as AppEvent[];

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-all-search"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checkbox-all-search" className="sr-only">
                    checkbox
                  </label>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                Event Title
              </th>
              <th scope="col" className="px-6 py-3">
                Event Date
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {eventsLoading ? (
              <tr>
                <td colSpan={4}>Loading...</td>
              </tr>
            ) : eventsError ? (
              <tr>
                <td colSpan={4}>{eventsError.message}</td>
              </tr>
            ) : (
              eventList.map((event) => (
                <EventRow key={event.title} {...event} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
