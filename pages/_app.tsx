// import "../styles/globals.css";
import "tailwindcss/tailwind.css";

import Head from "next/head";
import type { AppProps } from "next/app";

import { AuthProvider } from "@/firebase/auth";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Head>
        <title>BeeBeeLearn</title>
        <link rel="icon" href="/bee.svg" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
