import { Router } from 'express';
import { customerController } from './customer.controller';

const router = Router();

router.route('/customers')
  .get(customerController.list)
  .post(customerController.create);

router.route('/customers/:id')
  .get(customerController.get)
  .patch(customerController.update)
  .delete(customerController.delete);

/**
 * Instance of Customer router.
 */
export const customerRouter = router;
