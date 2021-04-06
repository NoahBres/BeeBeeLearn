import "../styles/globals.css";

import Head from "next/head";
import type { AppProps } from "next/app";

import { useEffect } from "react";
import nookies from "nookies";
import { FuegoProvider } from "@nandorojo/swr-firestore";

import client from "@/firebase/client";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).nookies = nookies;
    }
    return client.auth().onIdTokenChanged(async (user) => {
      console.log(`token changed!`);
      if (!user) {
        console.log(`no token found...`);

        nookies.destroy(null, "token");
        nookies.set(null, "token", "", { path: "/" });
        return;
      }

      console.log(`updating token...`);
      const token = await user.getIdToken();

      nookies.destroy(null, "token");
      nookies.set(null, "token", token, { path: "/" });
    });
  }, []);

  // force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      console.log(`refreshing token...`);
      const user = client.auth().currentUser;
      if (user) await user.getIdToken(true);
    }, 10 * 60 * 1000);
    return () => clearInterval(handle);
  }, []);

  return (
    <FuegoProvider fuego={client}>
      <Head>
        <title>BeeBeeLearn</title>
        <link rel="icon" href="/bee.svg" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>
      <Component {...pageProps} />
    </FuegoProvider>
  );
}

export default MyApp;
