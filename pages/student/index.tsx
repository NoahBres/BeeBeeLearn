import nookies from "nookies";
import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";

import firebaseAdmin from "@/firebase/admin";
import { queryChat, queryUser } from "@/firebase/query";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const cookies = nookies.get(ctx);
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);

    // We don't want unnecessary properties in the type e.g. password so strip them
    const dbUser = await queryUser(token.uid);
    const user = {
      name: dbUser.name,
      role: dbUser.role,
      id: dbUser.id,
    };

    const botChatRef = dbUser.chats.find((e) => {
      return (
        e.participants.length === 2 &&
        e.participants.includes("bot") &&
        e.participants.includes(user.id)
      );
    });

    const { meta, messages } = await queryChat(botChatRef.chatRef);

    return {
      props: { user, meta, messages },
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

const ChatBox = dynamic(() => import("./ChatBox/ChatBox"), { ssr: false });

const StudentHome = ({
  user,
  meta,
  messages,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div
      className="flex flex-col items-center justify-center w-full min-h-screen bg-yellow-200"
      style={{ backgroundImage: `url("${BG_SVG}")` }}
    >
      <ChatBox user={user} meta={meta} messages={messages} />
    </div>
  );
};

export default StudentHome;
