export type User = {
  id: string;

  name: string;
  password: string;
  role: "admin" | "student";

  // Contains ID's for the chat objects
  chats: {
    participants: string[];
    chatRef: FirebaseFirestore.DocumentReference;
  }[];
};

export type ChatMeta = {
  id: string;
  participants: string[];
  secret: string;
};

export type ChatMessage = {
  id: string;
  message: string;
  sender: string;
  time: string;
};
