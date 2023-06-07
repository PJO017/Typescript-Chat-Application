import { IncomingMessage, ServerResponse } from "http";
import { handleGetRoom, handleCreateRoom } from "./handlers";

export const requestListener = (req: IncomingMessage, res: ServerResponse) => {
  try {
    const method = req.method?.toUpperCase();
    console.log(`Method: ${method}`);
    switch (method) {
      case "GET":
        switch (req.url) {
          case "/rooms":
            handleGetRoom(req, res);
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
    // res.writeHead(400).end(error.message);
  }
};
