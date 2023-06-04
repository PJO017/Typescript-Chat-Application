import WebSocket from "ws";
import {
  joinRoom,
  rooms,
  User,
  createUser,
  clients,
  createRoom,
} from "./clients";

const handleMessage = (connection: WebSocket, rawData: any) => {
  try {
    const jsonData = JSON.parse(rawData);
    switch (jsonData.event) {
      case "message":
        handleBroadcastMessage(connection, jsonData.message);
        break;
      case "joinRoom":
        handleJoinRoom(connection, jsonData.roomId);
      case "createRoom":
        handleCreateRoom(connection, jsonData.name);
      default:
        throw Error("Not valid event.");
    }
  } catch (error) {
    console.error(error);
  }
};

const handleBroadcastMessage = (
  connection: WebSocket,
  message: string
): void => {
  try {
    if (!message) throw Error("No message found.");
    const user = clients.get(connection)!;
    let roomClients: Set<WebSocket>;
    if (user.currentRoom != "") {
      console.log(
        `Broadcasting message: ${message} to room: ${user.currentRoom}`
      );
      roomClients = rooms.get(user.currentRoom)!.connections;
    } else {
      console.log(`Broadcasting message: ${message}`);
      roomClients = new Set(clients.keys());
    }
    for (let client of roomClients) {
      if (client != connection) client.send(`${message}`);
    }
  } catch (error) {
    console.error(error);
  }
};

const handleJoinRoom = (connection: WebSocket, roomId: string): void => {
  const user = clients.get(connection)!.userId;
  console.log(`${user} joining room ${roomId}.`);
  try {
    joinRoom(connection, roomId);
    console.log(`${user} joined room ${roomId} successfully.`);
  } catch (error) {
    console.error(`${user} failed to join room ${roomId}: \nerror`);
  }
};

const handleCreateRoom = (connection: WebSocket, name: string): void => {
  try {
    const roomId = createRoom(name);
    connection.send(`Room: ${roomId} created successfully`);
  } catch (error) {
    console.error(`Failed to create room.`);
  }
};

const eventHandlers = (connection: WebSocket) => {
  connection.on("close", () => handleClose(connection));
  connection.on("message", (data) => handleMessage(connection, data));
};

export const handleConnection = (connection: WebSocket) => {
  const user: User = createUser("name");
  console.log(`Recieved new connection.`);

  clients.set(connection, user);
  console.log(`${user.userId} connected.`);

  eventHandlers(connection);
};

const handleClose = (connection: WebSocket) => {
  if (clients.has(connection)) {
    const userId: string = clients.get(connection)!.userId;
    clients.delete(connection);
    console.log(`${userId} disconnected`);
  } else {
    console.error("User not connected.");
  }
};
