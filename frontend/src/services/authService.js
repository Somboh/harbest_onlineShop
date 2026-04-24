import { api } from "./api";

const mockUsers = {
  client: {
    id: "client-1",
    name: "Pepe",
    email: "cliente@harbest.com",
    role: "client",
  },
  farmer: {
    id: "farmer-1",
    name: "Jaume",
    email: "agricultor@harbest.com",
    role: "farmer",
  },
};

export const authService = {
  login({ email, role = "client" } = {}) {
    const user = role === "farmer" || role === "admin" ? mockUsers.farmer : mockUsers.client;

    return api.post({
      ...user,
      email: email || user.email,
    });
  },

  logout() {
    return api.post(true);
  },
};

export default authService;
