import { Router } from 'express';
import { productController } from './product.controller';

const router = Router();

router.route('/products')
  .get(productController.list)
  .post(productController.create);

router.route('/products/:id')
  .get(productController.get)
  .patch(productController.update)
  .delete(productController.delete);

/**
 * Instance of Product router.
 */
export const productRouter = router;
