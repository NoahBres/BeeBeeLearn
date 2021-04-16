import Link from "next/link";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <meta
          property="og:image"
          content="https://images.unsplash.com/photo-1568526381923-caf3fd520382?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2700&q=80"
        />
      </Head>
      <main className="flex flex-col items-center justify-center w-full min-h-screen p-0 bg-yellow-200 ">
        <div className="flex flex-row items-center">
          <h1 className="text-5xl font-extrabold tracking-wide">BeeBeeLearn</h1>
          <img src="/bee-outline.svg" alt="BeeBee" className="w-16 h-16 ml-3" />
        </div>
        <div>
          <Link href="/student">
            <a>Student Home</a>
          </Link>
        </div>
      </main>
    </>
  );
}
