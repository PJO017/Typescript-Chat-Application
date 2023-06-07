import { IncomingMessage, ServerResponse } from "http";
import { rooms, createRoom } from "../users";

export const handleGetRoom = (
  req: IncomingMessage,
  res: ServerResponse
): void => {
  try {
    let roomData = [];
    for (const [key, value] of rooms.entries()) {
      roomData.push({
        id: key,
        name: value.name,
        numOfConnections: value.connections.size,
      });
    }
    res.writeHead(200);
    res.end(JSON.stringify(roomData));
  } catch (error) {
    console.error(error);
    res.writeHead(500).end(error);
  }
};

export const handleCreateRoom = (
  req: IncomingMessage,
  res: ServerResponse
): void => {
  try {
    let data = "";
    req
      .on("data", (chunk) => {
        data += chunk;
      })
      .on("end", () => {
        let roomData = JSON.parse(data);
        createRoom(roomData.name);
        console.log("Room created.");
        res.writeHead(201);
        res.end("Room created.");
      });
  } catch (error) {
    console.error(error);
    res.writeHead(500).end(error);
  }
};
