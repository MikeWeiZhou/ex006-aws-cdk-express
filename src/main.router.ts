import { Router } from 'express';
import { companyRouter } from './modules/company/company.router';
import { customerRouter } from './modules/customer/customer.router';

const router = Router();
router.use(companyRouter);
router.use(customerRouter);

/**
 * Instance of main router.
 */
export const mainRouter = router;
