import WebSocket from "ws";
import { randomUUID } from "crypto";

export type Room = {
  name: string;
  connections: Set<WebSocket>;
};

export type User = {
  userId: string;
  name: string;
  currentRoom: string;
};

export const users = new Map<WebSocket, User>();
export const rooms = new Map<string, Room>();

export const createUser = (name: string): User => {
  const userId = randomUUID();
  let currentRoom = "";
  const user: User = { userId, name, currentRoom };
  return user;
};

export const createRoom = (name: string): string => {
  const roomId = randomUUID();
  const connections: Set<WebSocket> = new Set();
  const room: Room = { name, connections };
  rooms.set(roomId, room);
  return roomId;
};

export const joinRoom = (connection: WebSocket, roomId: string): void => {
  try {
    if (!rooms.has(roomId)) {
      throw new Error("Room does not exist.");
    }
    rooms.get(roomId)!.connections.add(connection);
    users.get(connection)!.currentRoom = roomId;
  } catch (error) {
    console.log(error);
  }
};
