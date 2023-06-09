import { createServer, Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { handleConnection } from "./websockets/handlers";
import { requestListener } from "./http/routes";

const initWSServer = (server: Server): void => {
  const wss = new WebSocketServer({ server });
  wss.on("connection", (connection: WebSocket) => handleConnection(connection));
};

const initHttpServer = (port: Number): Server => {
  const server = createServer(requestListener);
  server.listen(port, () =>
    console.log(`Server is running on http://localhost:${port}`)
  );
  initWSServer(server);
  return server;
};

export const server = initHttpServer(8000);
