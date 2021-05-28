/**
 * Sale status code.
 */
export enum SaleStatusCode {
  /**
   * Order has been cancelled.
   */
  CANCELLED = 'CANCELLED',

  /**
   * Created order, ready to pay.
   */
  CREATED = 'CREATED',

  /**
   * Customer paid for order.
   */
  PAID = 'PAID',

  /**
   * Customer has refunded the order.
   */
  REFUNDED = 'REFUNDED',
}
