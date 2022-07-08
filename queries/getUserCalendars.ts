import { useQuery } from "react-query";

const getUserCalendars = async () => {
  return (await fetch(`/api/calendar/list`)).json();
};

export const getUserCalendarsQuery = () =>
  useQuery(
    "user-calendars",
    getUserCalendars,
    // prevent re-fetching on every render
    {
      refetchOnWindowFocus: false,
      // cache for 1 hour
      staleTime: 60 * 60 * 1000,
    }
  );
