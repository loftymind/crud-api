import request from 'supertest';
import { server } from '../index';

describe('Scenario 1', () => {
  it('Get all ', async () => {
    const res = await request(server).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  let idForTesting;
  it('create by a POST', async () => {
    const res = await request(server)
      .post('/api/users')
      .set('Accept', 'application/json')
      .send( {
        username: 'asd',
        age: 18,
        hobbies: ['asdd'],
      });
    idForTesting = res.body.id;
    expect(res.statusCode).toBe(201);
    expect(res.body.username).toEqual('asd');
    expect(res.body.age).toEqual(18);
    expect(res.body.hobbies).toEqual(['asdd']);
  });
  it('With a GET api/users/{userId} request, we try to get the created record by its id (the created record is expected)', async () => {
    const res = await request(server).get(`/api/users/${idForTesting}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toEqual('asd');
    expect(res.body.age).toEqual(18);
    expect(res.body.hobbies).toEqual(['asdd']);
  });
  it('update', async () => {
    const res = await request(server)
      .put(`/api/users/${idForTesting}`)
      .set('Accept', 'application/json')
      .send({
        username: 'ddd',
        age: 19,
        hobbies: ['asdw'],
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toEqual(idForTesting);
    expect(res.body.username).toEqual('ddd');
    expect(res.body.age).toEqual(19);
    expect(res.body.hobbies).toEqual(['asdw']);
  });
  it('DELETE api/users/{userId} ', async () => {
    const res = await request(server).delete(`/api/users/${idForTesting}`);
    expect(res.statusCode).toBe(204);
  });
  it('get a deleted object by id ', async () => {
    const res = await request(server).get(`/api/users/${idForTesting}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: 'User not found' });
  });
});

describe('Scenario 2', () => {
  it('GET with not uuid', async () => {
    const res = await request(server).get('/api/users/1321a');
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: 'Not an uuid' });
  });
  it('PUT with not uuid', async () => {
    const res = await request(server)
      .put('/api/users/43432')
      .set('Accept', 'application/json')
      .send({
        username: 'aqw',
        age: 22,
        hobbies: ['asd'],
      });
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: 'Invalid UUID' });
  });
  it('DELETE with not uuid', async () => {
    const res = await request(server).delete('/api/users/123123a');
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: 'Not an uuid' });
  });
  it('POST without the required field age', async () => {
    const res = await request(server)
      .post('/api/users')
      .set('Accept', 'application/json')
      .send({
        username: 'pig',
        hobbies: ['eat my food'],
      });
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'Does not contain required fields' });
  });
});

describe('Scenario 3', () => {
  it('GET with uuid that does not exist', async () => {
    const res = await request(server).get(
      '/api/users/f61a1454-05df-4c49-bfc1-13775338fc41'
    );
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: 'User not found' });
  });
  it('PUT with uuid that does not exist', async () => {
    const res = await request(server).put(
      '/api/users/f61a1454-05df-4c49-bfc1-13775338fc41'
    );
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: 'User not found' });
  });
  it('DELETE with uuid that does not exist', async () => {
    const res = await request(server).delete(
      '/api/users/f61a1454-05df-4c49-bfc1-13775338fc41'
    );
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: 'User not found' });
  });
  it('GET to route that does not exist', async () => {
    const res = await request(server).get('/api/players');
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: 'Route not found' });
  });
  it('POST to route that does not exist', async () => {
    const res = await request(server).post('/api/players');
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: 'Route not found' });
  });
  it('GET concrete user to the route that does not exist', async () => {
    const res = await request(server).get(
      '/api/players/f61a1454-05df-4c49-bfc1-13775338fc41'
    );
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: 'Route not found' });
  });
});
