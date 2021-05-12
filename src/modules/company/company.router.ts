import { Router } from 'express';
import companyController from './company.controller';

const router = Router();
router.route('/companies')
  .get(companyController.find)
  .post(companyController.create);
router.route('/companies/:companyId')
  .get(companyController.findOne)
  .patch(companyController.update)
  .delete(companyController.delete);

export default router;
