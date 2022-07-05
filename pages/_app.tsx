import type { AppProps } from "next/app";
import { ApplicationProviders } from "../components";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApplicationProviders>
      <Component {...pageProps} />
    </ApplicationProviders>
  );
}

export default MyApp;
