import { Router } from 'express';
import companyController from './company.controller';

const router = Router();

router.route('/companies')
  .get(companyController.list)
  .post(companyController.create);

router.route('/companies/:id')
  .get(companyController.get)
  .patch(companyController.update)
  .delete(companyController.delete);

export default router;
