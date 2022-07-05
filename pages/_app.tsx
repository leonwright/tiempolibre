import type { AppProps } from "next/app";
import { QueryClient } from "react-query";
import { ApplicationProviders } from "../components/ApplicationProviders";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApplicationProviders>
      <Component {...pageProps} />
    </ApplicationProviders>
  );
}

export default MyApp;
