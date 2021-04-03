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
  participants: string[];
  id: string;
};

export type ChatMessage = {
  message: string;
  sender: string;
  time: string;
};
