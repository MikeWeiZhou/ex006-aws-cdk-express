import { fake, request } from '@ear-tests/core';
import { Response } from 'supertest';

// root url path
const { rootPath } = fake.company;

describe('error-handling', () => {
  it('400: can return correct status code on invalid json syntax', async () => {
    const companyCreateDto = fake.company.dto();
    let invalidJsonData: string;
    let post: Response;

    invalidJsonData = `${JSON.stringify(companyCreateDto)},`;
    post = await request.post(rootPath).type('application/json').send(invalidJsonData);
    expect(post.statusCode).toBe(400);

    invalidJsonData = '[]';
    post = await request.post(rootPath).type('application/json').send(invalidJsonData);
    expect(post.statusCode).toBe(400);

    invalidJsonData = '-';
    post = await request.post(rootPath).type('application/json').send(invalidJsonData);
    expect(post.statusCode).toBe(400);

    invalidJsonData = ' ';
    post = await request.post(rootPath).type('application/json').send(invalidJsonData);
    expect(post.statusCode).toBe(400);

    invalidJsonData = '\n\n';
    post = await request.post(rootPath).type('application/json').send(invalidJsonData);
    expect(post.statusCode).toBe(400);
  });
});
