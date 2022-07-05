import type { NextPage } from "next";
import { useUser } from "@auth0/nextjs-auth0";
import { CreateEvent, Layout, ViewEvents } from "../components";
import { Card } from "flowbite-react";

import "react-datepicker/dist/react-datepicker.css";

const Home: NextPage = (props) => {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <Layout>
      <div className="mt-5">
        {user && (
          <div className="dark:text-white my-5 text-xl font-bold">
            Welcome, {user.name}
          </div>
        )}
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
      </div>
    </Layout>
  );
};

export default Home;
