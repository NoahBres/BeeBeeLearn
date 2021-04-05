import { useEffect, useState, useRef, FormEvent, useLayoutEffect } from "react";

import { firebaseClient } from "@/firebase/firebaseClient";

import { useCollectionData } from "react-firebase-hooks/firestore";

import { TransitionGroup, CSSTransition } from "react-transition-group";
import { PaperAirplaneIcon } from "@heroicons/react/solid";

import Message from "./Message";

import styles from "./ChatBox.module.css";

const ChatBox = ({
  user,
  meta,
  messages,
}: {
  user: any;
  meta: any;
  messages: any;
}) => {
  const chatMessageRef = useRef(
    firebaseClient
      .firestore()
      .collection("chats")
      .doc(meta.id)
      .collection("messages")
  );

  const [chatSnapshot, chatLoading, chatError] = useCollectionData(
    chatMessageRef.current.orderBy("time")
  );

  const [sendMessageInput, setSendMessageInput] = useState("");

  const [showSecret, setShowSecret] = useState(false);

  const scrollRef = useRef<HTMLSpanElement>();

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch("/api/send-message", {
      method: "POST",
      body: JSON.stringify({
        message: {
          message: sendMessageInput,
        },
        chatId: meta.id,
      }),
    });

    setSendMessageInput("");
    // scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // TODO: Come back and fix this
    if (showSecret && navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: "clipboard-write" })
        .then((result) => {
          if (result.state === "granted" || result.state === "prompt") {
            navigator.clipboard.writeText(meta.secret);
          }
        });
    }
  }, [showSecret]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useLayoutEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatSnapshot]);

  // TODO: type this
  const selectedMessages = chatLoading ? messages : chatSnapshot;

  return (
    <div className="flex flex-col w-[40rem] h-[90vh] bg-orange-200 flex-grow my-5 rounded-3xl shadow-md border border-yellow-300 overflow-hidden relative">
      <header className="flex flex-row items-center justify-between px-6 py-3 bg-white rounded-3xl">
        <h1 className="text-3xl font-black tracking-wide">
          Hi, {user.name}! <span className={styles.wave}>👋</span>
        </h1>
        <div
          onClick={() => setShowSecret((prev) => !prev)}
          className="px-3 py-2 transition rounded-md cursor-pointer group"
        >
          <p className="text-lg font-semibold leading-tight text-right select-none">
            secret 🤫
          </p>
          <p
            className={`relative text-lg leading-tight rounded px-2 py-1 select-none ${
              showSecret
                ? "bg-pink-100"
                : "bg-gray-300 text-transparent group-hover:bg-gray-400"
            } transition-colors`}
          >
            {meta.secret}
            <div
              className={`absolute inset-0 flex items-center justify-center h-full pointer-events-none ${
                showSecret ? "text-transparent" : "group-hover:text-black"
              } transition-colors`}
            >
              👀 👀
            </div>
          </p>
        </div>
      </header>
      {selectedMessages.length !== 0 ? (
        <TransitionGroup
          className={`flex flex-col flex-grow w-full p-5 px-3 pb-20 space-y-2 overflow-y-auto ${styles.chatMessageContainer}`}
        >
          {selectedMessages.map((e, i) => (
            <Message key={i} message={e.message} sender={e.sender} />
          ))}
          <span ref={scrollRef} />
        </TransitionGroup>
      ) : (
        <div className="flex flex-col items-center justify-center flex-grow">
          <p className="flex items-center text-2xl font-semibold text-center">
            no messages sent yet <span className="ml-2 text-3xl">🥺</span>
          </p>
        </div>
      )}

      <div className="absolute w-full px-3 pb-4" style={{ bottom: "0rem" }}>
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
  );
};

ChatBox.getInitialProps = async ({ req }) => {};

export default ChatBox;
