import { User } from '../utils/utils';
import { v4 as uuidv4 } from 'uuid';

export const users: User[] = [];

export const getUsers = () => {
  return users;
};

export const getById = (id: string) => {
  return users.find((p) => p.id === id);
};

export const createUser = (user: User) => {
  const newUser: User = { id: uuidv4(), ...user };
  users.push(newUser);
  return newUser;
};
export const updateUserByID = async (id: string, user: User): Promise<User> => {
  return new Promise((resolve, reject) => {
    const userIndex = users.findIndex(user => user.id === id);
    user[userIndex] = {id, ...user};
    users[userIndex] = user[userIndex];
    resolve(user[userIndex]);
  });
}
export const deleteUser = (id: string) => {
  const condidateIndex = users.findIndex((user) => user.id === id);

  if (condidateIndex !== -1) {
    users.splice(condidateIndex, 1);
  } else {
    new Error();
  }
};
