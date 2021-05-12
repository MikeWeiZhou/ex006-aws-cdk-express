import supertest from 'supertest';

const request = supertest((global as any).apiSocketAddress);

describe('/companies', () => {
  describe('post', () => {
    it('empty request returns status 200', async () => {
      const response = await request.get('/companies');
      expect(response.statusCode).toBe(200);
    });
  });
});
