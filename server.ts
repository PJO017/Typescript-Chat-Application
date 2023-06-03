import { WebSocketServer } from "ws";
import http from "http";

const server = http.createServer();
const wss = new WebSocketServer({ server });
const port = 8000;

server.listen(port, () =>
  console.log(`Websocket server is running on http://localhost:${port}`)
);
