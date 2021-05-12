import { Router } from 'express';
import companyRouter from '../modules/company/company.router';

const router = Router();
router.use(companyRouter);

export default router;
