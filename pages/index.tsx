import type { GetServerSideProps, NextPage } from "next";
import {
  getSession,
  UserProfile,
  useUser,
  withPageAuthRequired,
} from "@auth0/nextjs-auth0";
import { CreateEvent, Layout, ViewEvents } from "../components";
import { Card } from "flowbite-react";

import "react-datepicker/dist/react-datepicker.css";
import { getUserCalendarsQuery } from "../queries";
import { useRecoilState } from "recoil";
import { selectedCalendarState } from "../atoms";
import { ReactNode, useEffect } from "react";

interface PageProps {
  user: UserProfile;
}

// get user calendars ssr
export const getServerSideProps = withPageAuthRequired();

function Home({ user }: PageProps) {
  return (
    <Layout>
      <div className="mt-5">
        {user && (
          <div className="dark:text-white my-5 text-xl font-bold">
            Welcome, {user.name}{" "}
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
}

export default Home;
