import WebSocket from "ws";
import { randomUUID } from "crypto";

export type User = {
  userId: string;
  name: string;
};

export const createUser = (name: string): User => {
  const userId = randomUUID();
  const user: User = { userId, name };
  return user;
};

export const clients = new Map<WebSocket, User>();
