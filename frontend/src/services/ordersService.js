import { api } from "./api";

export const ESTADOS_PEDIDO = [
  "pendiente",
  "preparando",
  "enviado",
  "entregado",
  "cancelado",
];

//Estado en BD → texto y color para mostrar en la UI. Cliente y agricultor
//ven los mismos colores; el texto cambia ligeramente según el rol.
export const STATUS_LABEL_USER = {
  pendiente: "Pendiente",
  preparando: "Aceptado",
  enviado: "En camino",
  entregado: "Recibido",
  cancelado: "Cancelado",
};

export const STATUS_LABEL_FARMER = {
  pendiente: "Pendiente",
  preparando: "Aceptado",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

//Colores de fondo + texto para el badge de estado.
export const STATUS_COLORS = {
  pendiente: { bg: "#FBE9C8", text: "#8A6D1F" },
  preparando: { bg: "#E4F0CF", text: "#4F7A2F" },
  enviado: { bg: "#D4E8F5", text: "#2F5A7A" },
  entregado: { bg: "#DCE9CF", text: "#3F6E2F" },
  cancelado: { bg: "#FBE9E5", text: "#8C2A1A" },
};

//Identifica una "compra" (un único click de Finalizar compra) a partir de un
//pedido. Como cada checkout puede crear N pedidos —uno por agricultor— pero
//todos comparten la misma `direccion_envio` y se insertan dentro del mismo
//minuto, agrupamos por (direccion_envio, minuto de fecha) y obtenemos un
//identificador estable sin tocar el esquema de la BD.
export function purchaseKeyOf(order) {
  const minute = (order?.fecha ?? "").slice(0, 16); // "YYYY-MM-DDTHH:MM"
  return `${order?.direccion_envio ?? ""}|${minute}`;
}

//Agrupa pedidos por compra y devuelve un array ordenado de más reciente a más
//antigua. Cada elemento tiene { id, fecha, direccion_envio, orders, total,
//farmerCount, orderCount }.
export function groupOrdersByPurchase(orders) {
  if (!Array.isArray(orders)) return [];
  const groups = new Map();
  for (const o of orders) {
    const key = purchaseKeyOf(o);
    let group = groups.get(key);
    if (!group) {
      group = {
        id: key,
        fecha: o.fecha,
        direccion_envio: o.direccion_envio,
        orders: [],
      };
      groups.set(key, group);
    }
    group.orders.push(o);
    //Para la fecha del grupo nos quedamos con la más temprana del lote (todas
    //son del mismo minuto, pero por consistencia).
    if ((o.fecha ?? "").localeCompare(group.fecha ?? "") < 0) {
      group.fecha = o.fecha;
    }
  }
  return Array.from(groups.values())
    .map((g) => ({
      ...g,
      total: g.orders.reduce((s, o) => s + Number(o.total ?? 0), 0),
      farmerCount: new Set(g.orders.map((o) => o.farmer_email)).size,
      orderCount: g.orders.length,
    }))
    .sort((a, b) => (b.fecha ?? "").localeCompare(a.fecha ?? ""));
}

export const ordersService = {
  async getOrdersByUser(email) {
    return api.get(`/pedidos/user/${encodeURIComponent(email)}`);
  },

  async getOrdersByFarmer(email) {
    return api.get(`/pedidos/farmer/${encodeURIComponent(email)}`);
  },

  async getOrderById(id) {
    return api.get(`/pedidos/${id}`);
  },

  // dto: { user_email, farmer_email, lineas: [{product_id, cantidad}], direccion_envio? }
  async createOrder(dto) {
    return api.post("/pedidos/", dto, { auth: true });
  },

  async updateOrderStatus(id, estado) {
    return api.put(`/pedidos/${id}/estado`, { estado }, { auth: true });
  },
};

export default ordersService;
