import { UserProvider } from "@auth0/nextjs-auth0";
import { Flowbite } from "flowbite-react";
import { QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";

interface Props {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

export const ApplicationProviders = ({ children }: Props) => {
  return (
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <Flowbite>{children}</Flowbite>
        </RecoilRoot>
      </QueryClientProvider>
    </UserProvider>
  );
};
