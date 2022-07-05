import { useUser } from "@auth0/nextjs-auth0";
import { collection, deleteDoc, doc } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { firestore } from "../firebase/clientApp";
import moment from "moment";

interface AppEvent {
  id: string;
  title: string;
  description: string;
  date: { nanoseconds: number; seconds: number };
  delete: (id: string) => void;
}

const EventRow = (props: AppEvent) => {
  const date = moment(new Date(props.date.seconds * 1000)).format(
    "MMM Do YYYY"
  );
  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
      <td className="w-4 p-4">
        <div className="flex items-center">
          <input
            id="checkbox-table-search-1"
            type="checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label htmlFor="checkbox-table-search-1" className="sr-only">
            checkbox
          </label>
        </div>
      </td>
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
      >
        {props.title}
      </th>
      <td className="px-6 py-4">{date}</td>
      <td
        className="px-6 py-4 text-right"
        onClick={() => props.delete(props.id)}
      >
        <a
          href="#"
          className="font-medium text-red-600 dark:text-red-500 hover:underline"
        >
          Delete
        </a>
      </td>
    </tr>
  );
};

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

  const deleteDocument = async (id: string) => {
    const collectionPath = `users/${userId}/events`;
    await deleteDoc(doc(firestore, collectionPath, id));
  };

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
            {events &&
              eventList.map((event) => (
                <EventRow
                  key={event.title}
                  {...event}
                  delete={deleteDocument}
                />
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
