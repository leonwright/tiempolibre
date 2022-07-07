import type { AppProps } from "next/app";
import { ApplicationProviders } from "../components";
import { ReactQueryDevtools } from "react-query/devtools";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApplicationProviders>
      <>
        <Component {...pageProps} />
        <ReactQueryDevtools />
      </>
    </ApplicationProviders>
  );
}

export default MyApp;
