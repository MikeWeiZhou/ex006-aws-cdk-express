import { companyRouter } from '@ear/modules/company';
import { companyUserRouter } from '@ear/modules/company-user';
import { customerRouter } from '@ear/modules/customer';
import { productRouter } from '@ear/modules/product';
import { saleRouter } from '@ear/modules/sale';
import { Router } from 'express';

const router = Router();
router.use(companyRouter);
router.use(companyUserRouter);
router.use(customerRouter);
router.use(productRouter);
router.use(saleRouter);

/**
 * Instance of main router.
 */
export const mainRouter = router;
