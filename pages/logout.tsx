import nookies from "nookies";

import { useRouter } from "next/router";
import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";

import { firebaseAdmin } from "@/firebase/firebaseAdmin";
import { firebaseClient } from "@/firebase/firebaseClient";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const cookies = nookies.get(ctx);
    console.log(JSON.stringify(cookies, null, 2));
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
    const { uid, email } = token;

    // the user is authenticated!
    // FETCH STUFF HERE

    console.log(token);

    return {
      props: { message: `Your email is ${email} and your UID is ${uid}.` },
    };
  } catch (err) {
    // either the `token` cookie didn't exist
    // or token verification failed
    // either way: redirect to the login page
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      // `as never` is required for correct type inference
      // by InferGetServerSidePropsType below
      props: {} as never,
    };
  }
};

export default function Logout() {
  const router = useRouter();

  const logout = () => {
    firebaseClient
      .auth()
      .signOut()
      .then(() => router.push("/"));
  };

  return <button onClick={logout}>Logout</button>;
}
