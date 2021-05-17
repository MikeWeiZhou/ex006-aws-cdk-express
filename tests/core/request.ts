import supertest from 'supertest';
import config from '../config';

/**
 * Request object from supertest.
 */
export default supertest(config.baseUrl);
