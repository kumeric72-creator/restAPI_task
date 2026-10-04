import request from 'supertest';
import app from '../src/server';

describe('Task REST API Integration Tests', () => {
  it('POST /api/tasks returns 400 validation error when title is missing', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ description: 'No title provided', dueDate: '2026-10-10' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation Error');
  });

  it('POST /api/tasks creates a task successfully', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({
        title: 'New Unit Test Task',
        description: 'Testing task creation',
        status: 'TODO',
        dueDate: '2026-10-15'
      });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('New Unit Test Task');
  });

  it('GET /api/tasks fetches list of tasks', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});