import { mockOrders } from "../data/mockOrders";
import { api } from "./api";

export const ordersService = {
  getOrders() {
    return api.get(mockOrders);
  },

  getOrderById(orderId) {
    return api.get(mockOrders.find((order) => order.id === orderId));
  },

  createOrder(order) {
    return api.post({
      id: `order-${Date.now()}`,
      status: "Pendiente",
      date: new Date().toISOString().slice(0, 10),
      ...order,
    });
  },

  updateOrderStatus(orderId, status) {
    return api.post({ orderId, status });
  },
};

export default ordersService;
