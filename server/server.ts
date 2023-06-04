import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { handleConnection } from "./handlers";

const initServer = (port: number): WebSocketServer => {
  const server = http.createServer();
  const wss = new WebSocketServer({ server });

  server.listen(port, () =>
    console.log(`Websocket server is running on http://localhost:${port}`)
  );
  return wss;
};

const start = () => {
  const wss = initServer(8000);
  wss.on("connection", (connection: WebSocket) => handleConnection(connection));
};

start();
