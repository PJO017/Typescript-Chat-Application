import { IncomingMessage, ServerResponse } from "http";
import { handleGetRooms, handleCreateRoom, handleGetUsers } from "./handlers";

export const requestListener = (req: IncomingMessage, res: ServerResponse) => {
  try {
    const method = req.method?.toUpperCase();
    console.log(`Method: ${method}`);
    switch (method) {
      case "GET":
        switch (req.url) {
          case "/rooms":
            handleGetRooms(req, res);
            break;
          case "/users":
            handleGetUsers(req, res);
            break;
        }
        break;
      case "POST":
        switch (req.url) {
          case "/rooms":
            handleCreateRoom(req, res);
            break;
        }
        break;
    }
  } catch (error: any) {
    res.writeHead(400).end(error.message);
  }
};
