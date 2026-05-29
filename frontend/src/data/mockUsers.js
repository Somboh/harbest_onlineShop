import { USER_ROLES } from "../constants/userRoles";

export const mockUsers = [
  {
    id: "client-1",
    name: "Pepe",
    email: "cliente@harbest.com",
    role: USER_ROLES.CLIENT,
    city: "Valencia",
  },
  {
    id: "farmer-1",
    name: "Jaume",
    email: "agricultor@harbest.com",
    role: USER_ROLES.FARMER,
    city: "Xativa",
    farmName: "Granjas Jaume",
  },
];

export default mockUsers;
