import { useEffect, useState, useRef, FormEvent } from "react";

import nookies from "nookies";
import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";

import { useCollectionData } from "react-firebase-hooks/firestore";

import { firebaseAdmin } from "@/firebase/firebaseAdmin";
import { firebaseClient } from "@/firebase/firebaseClient";
import { queryChat, queryUser } from "@/firebase/query";

import { TransitionGroup, CSSTransition } from "react-transition-group";
import { PaperAirplaneIcon } from "@heroicons/react/solid";

import styles from "./Student.module.css";

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

const StudentHome = ({
  user,
  meta,
  messages,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const chatMessageRef = useRef(
    firebaseClient
      .firestore()
      .collection("chats")
      // TODO: FIX THIS
      .doc(meta.id)
      .collection("messages")
  );

  // const [messages, setMessages] = useState();

  const [chatSnapshot, chatLoading, chatError] = useCollectionData(
    chatMessageRef.current.orderBy("time")
  );

  const [sendMessageInput, setSendMessageInput] = useState("");

  useEffect(() => {
    if (chatSnapshot) {
      console.log(chatSnapshot);
      // setMessages(chatSnapshot.messages);
    }
  }, [chatSnapshot]);

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await chatMessageRef.current.add({
      message: sendMessageInput,
      sender: user.id,
      time: firebaseClient.firestore.FieldValue.serverTimestamp(),
    });

    setSendMessageInput("");
  };

  const selectedMessages = chatLoading ? messages : chatSnapshot;

  return (
    <div
      className="flex flex-col items-center justify-center w-full min-h-screen bg-yellow-200"
      style={{ backgroundImage: `url("${BG_SVG}")` }}
    >
      <div className="flex flex-col w-[40rem] h-[90vh] bg-orange-200 flex-grow my-5 rounded-3xl shadow-md border border-yellow-300 overflow-hidden">
        <header className="px-6 py-5 bg-white rounded-3xl">
          <h1 className="text-3xl font-black tracking-wide">
            Hi, {user.name}! 👋
          </h1>
        </header>
        {selectedMessages.length !== 0 ? (
          <TransitionGroup className="flex flex-col flex-grow w-full p-5 space-y-2 overflow-y-auto">
            {selectedMessages.map((e, i) => {
              if (e.sender === "bot") {
                return (
                  <CSSTransition
                    key={i}
                    timeout={150}
                    classNames={{ ...styles }}
                  >
                    <div className="self-start px-4 py-3 bg-white border border-gray-100 rounded-bl-sm rounded-2xl w-max">
                      {e.message}
                    </div>
                  </CSSTransition>
                );
              } else {
                return (
                  <CSSTransition
                    key={i}
                    timeout={150}
                    classNames={{ ...styles }}
                  >
                    <div className="self-end px-4 py-3 text-white bg-orange-600 border border-transparent rounded-br-sm rounded-2xl w-max">
                      {e.message}
                    </div>
                  </CSSTransition>
                );
              }
            })}
          </TransitionGroup>
        ) : (
          <div className="flex flex-col items-center justify-center flex-grow">
            <p className="flex items-center text-2xl font-semibold text-center">
              no messages sent yet <span className="ml-2 text-3xl">🥺</span>
            </p>
          </div>
        )}

        <div className="w-full px-3 pb-4">
          <form
            onSubmit={sendMessage}
            className="flex items-center w-full transition bg-white border border-orange-300 rounded-full shadow-md h-14 ring ring-transparent focus-within:ring-opacity-50 focus-within:ring-orange-400 focus-within:border-orange-500"
          >
            <input
              onChange={(e) => setSendMessageInput(e.target.value)}
              value={sendMessageInput}
              placeholder="say something nice :D"
              className="flex-grow h-full ml-6 text-lg font-medium bg-transparent focus:outline-none"
            />
            <button
              type="submit"
              disabled={sendMessageInput.length === 0}
              className="flex items-center justify-center w-10 h-10 mr-[0.45rem] bg-blue-400 rounded-full focus:outline-none ring ring-transparent focus:bg-blue-500 hover:ring-blue-500 hover:ring-opacity-40 transition duration-200 disabled:bg-gray-500 disabled:pointer-events-none"
            >
              <PaperAirplaneIcon className="w-6 h-6 text-white transform rotate-90 translate-x-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
