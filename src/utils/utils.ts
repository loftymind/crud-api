
import {v4 as uuid4,validate, version} from 'uuid';
import { IncomingMessage } from 'http';
export const contType = { 'Content-Type': 'application/json' };

export interface User {
    id?: string | typeof uuid4;
    username: string,
    age: number,
    hobbies: string[]
}

export const validateUuid = (id: string): boolean => {
  return validate(id) && version(id) === 4;
}


export const getBodyData = (req: IncomingMessage)
  : Promise<any> => new Promise((resolve, reject) => {
  try {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      resolve(JSON.parse(body));
    });
  } catch (error) {
    reject(error);
  }
});

