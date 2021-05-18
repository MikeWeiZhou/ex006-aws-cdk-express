import { Router } from 'express';
import { companyRouter } from './company/company.router';

const router = Router();
router.use(companyRouter);

/**
 * Instance of main router.
 */
export const mainRouter = router;
