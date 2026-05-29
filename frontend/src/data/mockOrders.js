import { mockProducts } from "./mockProducts";

export const mockOrders = [
  {
    id: "order-1001",
    customerName: "Pepe",
    farmerName: "Granjas Jaume",
    status: "Preparando",
    date: "2026-04-22",
    total: 8.4,
    items: [
      {
        product: mockProducts[0],
        quantity: 2,
      },
    ],
  },
  {
    id: "order-1002",
    customerName: "Pepe",
    farmerName: "Illo verdulerias",
    status: "Entregado",
    date: "2026-04-20",
    total: 6.4,
    items: [
      {
        product: mockProducts[1],
        quantity: 2,
      },
    ],
  },
];

export default mockOrders;
