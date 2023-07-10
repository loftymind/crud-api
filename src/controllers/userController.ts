import { IncomingMessage, ServerResponse } from 'http';
import { User, contType, getBodyData, validateUuid } from '../utils/utils';
import {
  createUser,
  deleteUser,
  getById,
  getUsers,
  updateUserByID,

} from '../models/userModel';

export const getAll = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const users = await getUsers();

    res.writeHead(200, contType);
    res.end(JSON.stringify(users));
  } catch (error) {
    res.writeHead(500, contType);
    res.end(JSON.stringify({ error: 'Server Error' }));
  }
};
export const getByIdUser = async (
  req: IncomingMessage,
  res: ServerResponse,
  id: string
) => {
  try {
    const condidate = await getById(id);
    if(validateUuid(id)){
    if (!condidate) {
      res.writeHead(404, contType);
      res.write(JSON.stringify({message: 'User not found'}));
      res.end();
  } else {
      res.writeHead(200, contType);
      res.write(JSON.stringify(condidate));
      res.end();
  }} else {
    res.writeHead(400, contType);
    res.write(JSON.stringify({message: 'Not an uuid'}));
    res.end();
}
  } catch (error) {
    res.writeHead(500, contType);
    res.end(JSON.stringify({ error: 'Server error' }));
  }
};
export const postUser = async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  try {
    const body = await getBodyData(req);

    if (body.username && body.age && body.hobbies) {
      const newUser: User = await createUser(body);
      res.writeHead(201, contType);
      res.end(JSON.stringify(newUser));
    } else {
      res.writeHead(400, contType);
      res.end(JSON.stringify({ error: 'Does not contain required fields' }));
    }
  } catch (error) {
    res.writeHead(500, contType);
    res.end(JSON.stringify({ error: 'Server Error' }));
  }
};
export const updUser = async (
  req: IncomingMessage,
  res: ServerResponse,
  id: string
): Promise<void> => {
  try {
    const user: User = await getById(id);

    if (!validateUuid(id)) {
      res.writeHead(400, contType);
      res.end(JSON.stringify({ message: 'Invalid UUID' }));
    } else if (!user) {
      res.writeHead(404, contType);
      res.end(JSON.stringify({ message: 'User not found' }));
    } else {
      const body: User = await getBodyData(req);
      const { username, age, hobbies } = JSON.parse(JSON.stringify(body));
      const updatedUser: User = {
        id: id,
        username: username || user.username,
        age: age || user.age,
        hobbies: hobbies || user.hobbies,
      };

      const newUpdatedUser: User = await updateUserByID(id, updatedUser);

      res.writeHead(200, contType);
      res.end(JSON.stringify(newUpdatedUser));
    }
  } catch (error) {
    res.writeHead(500, contType);
    res.end(JSON.stringify({ error: 'Server Error' }));
  }
};

export const remove = async (
  req: IncomingMessage,
  res: ServerResponse,
  id: string
) => {
  try {
        
    if (validateUuid(id)) {
        const product = await getById(id);

        if (!product) {
            res.writeHead(404, contType);
            res.write(JSON.stringify({message: 'User not found'}));
            res.end();
        } else {
            await deleteUser(id);
            res.writeHead(204, contType);
            res.end();
        }
    } else {
        res.writeHead(400, contType);
        res.write(JSON.stringify({message: 'Not an uuid'}));
        res.end();
    }
    
    
} catch (error) {
    res.writeHead(500, contType);
    res.write(JSON.stringify({message: 'Server error'}));
    res.end();
}
  /* try {
    
    await deleteUser(id);
    res.writeHead(204, contType);
    res.end();
  } catch (error) {
    res.writeHead(404, contType);
    res.end(JSON.stringify({ error: 'User not Found' }));
  } */
};
