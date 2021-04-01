import nookies from "nookies";
import { useRouter } from "next/router";
import { firebaseAdmin } from "@/firebase/firebaseAdmin";
import { firebaseClient } from "@/firebase/firebaseClient";
import { getUser } from "@/firebase/query";

import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";
import { UserBare } from "@/firebase/types";

import { PaperAirplaneIcon } from "@heroicons/react/solid";

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

const BG_SVG_COLOR = "92400E";
const BG_OPACITY = 0.08;
const BG_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%23${BG_SVG_COLOR}' fill-opacity='${BG_OPACITY}' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`;

const StudentHome = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const router = useRouter();

  return (
    <div
      className="flex flex-col items-center justify-center w-full min-h-screen bg-yellow-200"
      style={{ backgroundImage: `url("${BG_SVG}")` }}
    >
      <div className="flex flex-col w-[40rem] bg-orange-200 flex-grow my-5 rounded-3xl shadow-md border border-yellow-300 overflow-hidden">
        <header className="px-6 py-5 bg-white border border-gray-200 rounded-3xl">
          <h1 className="text-3xl font-black tracking-wide">
            Hi, {props.user.name}! 👋
          </h1>
        </header>
        <div className="flex-grow w-full p-5">test</div>
        <div className="w-full px-3 pb-4">
          <div className="flex items-center w-full transition bg-white border border-orange-300 rounded-full shadow-md h-14 ring ring-transparent focus-within:ring-opacity-50 focus-within:ring-orange-400 focus-within:border-orange-500">
            <input
              placeholder="Send a message!"
              className="flex-grow h-full ml-6 text-lg font-medium bg-transparent focus:outline-none"
            />
            <button className="flex items-center justify-center w-10 h-10 mr-[0.45rem] bg-blue-400 rounded-full focus:outline-none ring ring-transparent focus:bg-blue-500 hover:ring-blue-500 hover:ring-opacity-40 transition duration-200">
              <PaperAirplaneIcon className="w-6 h-6 text-white transform rotate-90 translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
