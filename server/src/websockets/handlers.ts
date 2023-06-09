import WebSocket from "ws";
import { joinRoom, rooms, User, createUser, users, createRoom } from "../users";
import { url } from "inspector";

const handleMessage = (connection: WebSocket, rawData: any) => {
  try {
    const jsonData = JSON.parse(rawData);
    switch (jsonData.event) {
      case "createUser":
        handleCreateUser(connection, jsonData.userName);
        break;
      case "message":
        handleBroadcastMessage(connection, jsonData.message);
        break;
      case "joinRoom":
        handleJoinRoom(connection, jsonData.roomId);
        break;
      case "createRoom":
        handleCreateRoom(connection, jsonData.name);
        break;
      case "leaveRoom":
        handleLeaveRoom(connection);
        break;
      default:
        throw Error("Not valid event.");
    }
  } catch (error) {
    console.error(error);
  }
};

const handleCreateUser = (connection: WebSocket, userName: string) => {
  let user: User;
  if (users.has(connection)) {
    user = { ...users.get(connection)!, name: userName };
  } else {
    user = createUser(userName);
  }
  users.set(connection, user);
  console.log(`${user.userId} connected.`);
};

const handleBroadcastMessage = (
  connection: WebSocket,
  message: string
): void => {
  try {
    if (!message) throw Error("No message found.");
    const user = users.get(connection)!;
    let roomClients: Set<WebSocket>;
    if (user.currentRoom != "") {
      console.log(
        `Broadcasting message: ${message} to room: ${user.currentRoom}`
      );
      roomClients = rooms.get(user.currentRoom)!.connections;
    } else {
      console.log(`Broadcasting message: ${message}`);
      roomClients = new Set(users.keys());
    }
    for (let client of roomClients) {
      if (client != connection) client.send(`${message}`);
    }
  } catch (error) {
    console.error(error);
  }
};

const handleJoinRoom = (connection: WebSocket, roomId: string): void => {
  const user = users.get(connection)!.userId;
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
    console.log(`Room: ${roomId} created successfully`);
    connection.send(`Room: ${roomId} created successfully`);
  } catch (error) {
    console.error(`Failed to create room.`);
    connection.send(`Failed to create room.`);
  }
};

const handleLeaveRoom = (connection: WebSocket): void => {
  try {
    const user = users.get(connection)!;
    const roomId = user.currentRoom;
    rooms.get(user.currentRoom)?.connections.delete(connection);
    user.currentRoom = "";
    console.log(`${user.userId} left room: ${roomId}`);
  } catch (error) {
    console.error(error);
  }
};

const eventHandlers = (connection: WebSocket) => {
  connection.on("close", () => handleClose(connection));
  connection.on("message", (data) => handleMessage(connection, data));
};

export const handleConnection = (connection: WebSocket) => {
  console.log(`Recieved new connection, ${connection}`);
  eventHandlers(connection);
};

const handleClose = (connection: WebSocket) => {
  if (users.has(connection)) {
    const userId: string = users.get(connection)!.userId;
    users.delete(connection);
    console.log(`${userId} disconnected`);
  } else {
    console.error("User not connected.");
  }
};
