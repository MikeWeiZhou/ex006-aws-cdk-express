import { Router } from 'express';
import { companyRouter } from '@ear/modules/company';
import { customerRouter } from '@ear/modules/customer';
import { productRouter } from '@ear/modules/product';

const router = Router();
router.use(companyRouter);
router.use(customerRouter);
router.use(productRouter);

/**
 * Instance of main router.
 */
export const mainRouter = router;
