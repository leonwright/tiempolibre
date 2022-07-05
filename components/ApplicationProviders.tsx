import { UserProvider } from "@auth0/nextjs-auth0";
import { Flowbite } from "flowbite-react";
import { QueryClient, QueryClientProvider } from "react-query";

interface Props {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

export const ApplicationProviders = ({ children }: Props) => {
  return (
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        <Flowbite>{children}</Flowbite>
      </QueryClientProvider>
    </UserProvider>
  );
};
