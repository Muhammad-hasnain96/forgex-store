/** Store configuration — client-safe defaults. */
export const SHIPPING_FEE = 200;
export const FREE_SHIPPING_MIN = 3000;
export const LOW_STOCK_THRESHOLD = 10;

export function calcShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
}

export function calcOrderTotal(subtotal: number, discount: number, shippingFee: number): number {
  return Math.max(0, subtotal - discount + shippingFee);
}
