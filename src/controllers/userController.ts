import { IncomingMessage, ServerResponse } from "http";
import { contType } from "../utils/utils";
import { getUsers } from "../models/userModel";

export const getAll = async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const users = await getUsers();
  
      res.writeHead(200, contType);
      res.end(JSON.stringify(users));
    } catch (error) {
      res.writeHead(500, contType);
      res.end(JSON.stringify({ error: 'Server Error'  }));
    }
  };

  
