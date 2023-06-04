import WebSocket, { WebSocketServer } from "ws";
import { User, createUser, clients } from "./clients";

export const handleConnection = (connection: WebSocket) => {
  const user: User = createUser("name");
  console.log(`Recieved new connection.`);

  clients.set(connection, user);
  console.log(`${user.userId} connected.`);

  connection.on("close", () => handleClose(connection));
  connection.on("message", (data) => handleMessage(connection, data));
};

export const handleClose = (connection: WebSocket) => {
  if (clients.has(connection)) {
    const userId: string = clients.get(connection)!.userId;
    clients.delete(connection);
    console.log(`${userId} disconnected`);
  } else {
    console.error("User not connected.");
  }
};

export const handleMessage = (connection: WebSocket, data: any) => {
  console.log(`Distributing message: ${data}`);
  for (let client of clients.keys()) {
    if (client != connection) client.send(`${data}`);
  }
};
