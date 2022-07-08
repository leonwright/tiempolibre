import { useQuery } from "react-query";

const getUserCalendar = async (id: string) => {
  return (await fetch(`/api/calendar/${id}/event/list`)).json();
};

export const getCalendarByIdQuery = (id: string) => {
  return useQuery(
    `user-calendar-${id}`,
    getUserCalendar.bind(null, id),
    // prevent re-fetching on every render
    {
      refetchOnWindowFocus: false,
      // cache for 1 hour
      staleTime: 60 * 60 * 1000,
    }
  );
};
