import { SessionProvider } from "next-auth/react";
import { Header } from "../components/Header";
import type { AppProps } from "next/app";
import "../styles/global.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={(pageProps as any).session}>
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
