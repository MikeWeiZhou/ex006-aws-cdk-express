import supertest from 'supertest';
import config from '../config';

/**
 * Request object from supertest.
 */
export const request = supertest(config.baseUrl);
