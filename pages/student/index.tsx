import nookies from "nookies";
import { useRouter } from "next/router";
import { firebaseAdmin } from "@/firebase/firebaseAdmin";
import { firebaseClient } from "@/firebase/firebaseClient";
import { getUser } from "@/firebase/query";

import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";
import { UserBare } from "@/firebase/types";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const cookies = nookies.get(ctx);
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);

    const user = (await getUser(token.uid)) as UserBare;

    return {
      props: { user },
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

const StudentHome = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const router = useRouter();

  return (
    <div>
      <h1>Student Home</h1>
      <p>{props.user.name}</p>
      <p>{props.user.id}</p>
      <p>{props.user.role}</p>
      {/* <p>{props.message}</p> */}
    </div>
  );
};

export default StudentHome;
