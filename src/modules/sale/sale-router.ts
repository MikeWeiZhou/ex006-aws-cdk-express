import { Router } from 'express';
import { saleController } from './sale-controller';

const router = Router();

router.route('/sales')
  .get(saleController.list)
  .post(saleController.create);

router.route('/sales/:id')
  .get(saleController.get)
  .patch(saleController.update)
  .delete(saleController.delete);

router.route('/sales/:id/cancel')
  .post(saleController.cancel);

router.route('/sales/:id/pay')
  .post(saleController.pay);

router.route('/sales/:id/refund')
  .post(saleController.refund);

/**
 * Instance of Sale router.
 */
export const saleRouter = router;
