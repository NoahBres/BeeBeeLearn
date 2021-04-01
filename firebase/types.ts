import { DocumentReference } from "@firebase/firestore-types";

export type User = {
  id: string;

  name?: string;
  password?: string;
  passwordProvider?: "LOCAL" | "GOOGLE";
  role?: "admin" | "student";
  uid?: string;

  // Contains ID's for the chat objects
  chats?: {
    participants: string[];
    id: DocumentReference;
  }[];
};

export type Chat = {
  participants: (Pick<User, "id" | "name"> | "bot")[];
  id: string;
  messages: ChatMessage[];
};

export type ChatMessage = {
  message: string;
  sender: Pick<User, "id" | "name"> | "bot";
  time: string;
};
