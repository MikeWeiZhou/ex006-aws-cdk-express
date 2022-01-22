import { Router } from 'express';
import { companyUserController } from './company-user-controller';

const router = Router();

router.route('/company-users')
  // .get(companyUserController.list)
  .post(companyUserController.create);

router.route('/company-users/:id')
  .get(companyUserController.get)
  .patch(companyUserController.update)
  .delete(companyUserController.delete);

/**
 * Instance of CompanyUser router.
 */
export const companyUserRouter = router;
