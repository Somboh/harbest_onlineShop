import { calculateCartSubtotal } from "../utils/helpers";

export const cartService = {
  getSubtotal(items) {
    return calculateCartSubtotal(items);
  },

  getShipping(items) {
    return items.length > 0 ? 2.5 : 0;
  },

  getTotal(items) {
    const subtotal = calculateCartSubtotal(items);
    const shipping = items.length > 0 ? 2.5 : 0;

    return subtotal + shipping;
  },
};

export default cartService;
