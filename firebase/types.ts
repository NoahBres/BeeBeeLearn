export type User = {
  name?: string;
  password?: string;
  passwordProvider?: "LOCAL" | "GOOGLE";
  role?: "admin" | "student";
  uid?: string;
  id: string;
};
