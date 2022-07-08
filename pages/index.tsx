import type { NextPage } from "next";
import { useUser } from "@auth0/nextjs-auth0";
import { CreateEvent, Layout, ViewEvents } from "../components";
import { Card } from "flowbite-react";

import "react-datepicker/dist/react-datepicker.css";
import { getUserCalendarsQuery } from "../queries";
import { useRecoilState } from "recoil";
import { selectedCalendarState } from "../atoms";
import { ReactNode, useEffect } from "react";

const Home: NextPage = (props) => {
  const { user, error, isLoading } = useUser();
  const {
    isLoading: calendarsLoading,
    isError: isCalendarsError,
    data: calendars,
    error: calendarsError,
  } = getUserCalendarsQuery();

  const [calendarState, setCalendarState] = useRecoilState(
    selectedCalendarState
  );

  useEffect(() => {
    console.log("test");
    if (!calendarsError && !calendarsLoading && calendars && user) {
      // find primary calendar and set it as the selected calendar
      const primaryCalendar = calendars.find(
        (calendar: any) => calendar.primary
      );
      if (primaryCalendar) {
        console.log(primaryCalendar);
        setCalendarState({
          id: primaryCalendar.id,
          name: primaryCalendar.name,
        });
      }
    }
  }, [calendarsLoading]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const renderSelectOptions = (calendars: any): ReactNode => {
    return calendars?.map((calendar: any): ReactNode => {
      return (
        <option key={calendar.id} value={calendar.id}>
          {calendar.name}
        </option>
      );
    });
  };

  console.log(calendarState);

  return (
    <Layout>
      <div className="mt-5">
        {user && (
          <div className="dark:text-white my-5 text-xl font-bold">
            Welcome, {user.name}{" "}
            <label
              htmlFor="selectedCalendar"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
            >
              Select Calendar
            </label>
            <select
              value={calendarState.id}
              onChange={(e) => {
                console.log(e.target.value);
                setCalendarState({
                  id: e.target.value,
                  name: e.target.options[e.target.selectedIndex].text,
                });
              }}
              id="selectedCalendar"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              {renderSelectOptions(calendars)}
            </select>
          </div>
        )}

        {user ? (
          <>
            <div className="mb-10">
              <Card>
                <ViewEvents />
              </Card>
            </div>
            <div className="mb-10">
              <Card>
                <CreateEvent />
              </Card>
            </div>
          </>
        ) : (
          <>
            <div className="dark:text-white text-gray-900">
              You must be logged to continue.
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Home;
