export type User = {
  name?: string;
  password?: string;
  passwordProvider?: "LOCAL" | "GOOGLE";
  role?: "admin" | "student";
  uid?: string;
  id: string;
};

// Stripped down user type
export type UserBare = Required<Pick<User, "name" | "role" | "id">>;
