
import * as http from 'http';
import { users} from './src/models/userModel';
import { getAll, getByIdUser, postUser, remove, updUser } from './src/controllers/userController';
import cluster from 'cluster';
import { User } from './src/utils/utils';

const PORT = 4000;

let data: User[] = users;

export const server = http.createServer(async (req: any, res: http.ServerResponse): Promise<void> => {
  if (req.url === '/api/users' && req.method === 'GET') {
    getAll(req, res);
  }
  else if (req.url === '/api/users' && req.method === 'POST') {
    postUser(req, res);
  }
  else if (req.url.match(/\/api\/users\/\w+/) && req.method === 'GET') {
    const id: string = req.url.split('/')[3];
    getByIdUser(req, res, id);    
  } 
  else if (req.url.match(/\/api\/users\/\w+/) && req.method === 'PUT') {
    const id: string = req.url.split('/')[3];
    updUser(req, res, id);
  }
  else if (req.url.match(/\/api\/users\/\w+/) && req.method === 'DELETE') {
    const id: string = req.url.split('/')[3];
    remove(req, res, id);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
}).listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

if (cluster.isWorker) {
  process.on('message', (workerData: User[]) => {
    data = workerData;
  });
}


