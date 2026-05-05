import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "./api";

const url = API_BASE_URL;

export const authService = {
  async userLogin(data) {
    try {
      const res = await fetch(`${url}/auth/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resultado = await res.json();

      if (resultado.accessToken) {
        await AsyncStorage.setItem("token", resultado.accessToken);
        await AsyncStorage.setItem("role", "user");
        return { status: "OK" };
      }
      //Devolvemos el cuerpo tal cual para que la pantalla pueda mostrar el
      //mensaje real del servidor (status + message). NO usar alert() aquí.
      return resultado ?? { status: "ERROR", message: "Error desconocido" };
    } catch (error) {
      console.error("Error en el login:", error);
      return { status: "ERROR", message: "No se pudo conectar con el servidor" };
    }
  },

  async farmerLogin(data) {
    try {
      const res = await fetch(`${url}/auth/farmer/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resultado = await res.json();

      if (resultado.accessToken) {
        await AsyncStorage.setItem("token", resultado.accessToken);
        await AsyncStorage.setItem("role", "farmer");
        return { status: "OK" };
      }
      return resultado ?? { status: "ERROR", message: "Error desconocido" };
    } catch (error) {
      console.error("Error en el login:", error);
      return { status: "ERROR", message: "No se pudo conectar con el servidor" };
    }
  },

  //El backend espera multipart/form-data (multer + foto). `data` debe ser
  //FormData con los campos: nombre, email, contra, foto. NO se fija el header
  //Content-Type a mano: fetch lo añade con el boundary correcto al detectar
  //FormData. Si llega un objeto plano, se acepta como fallback JSON.
  async userRegister(data) {
    try {
      const isFormData =
        typeof FormData !== "undefined" && data instanceof FormData;
      const response = await fetch(`${url}/auth/user/register`, {
        method: "POST",
        headers: isFormData ? {} : { "Content-Type": "application/json" },
        body: isFormData ? data : JSON.stringify(data),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error en el registro:", error);
      return { status: "ERROR", message: "No se pudo conectar con el servidor" };
    }
  },

  async farmerRegister(data) {
    try {
      const isFormData =
        typeof FormData !== "undefined" && data instanceof FormData;
      const response = await fetch(`${url}/auth/farmer/register`, {
        method: "POST",
        headers: isFormData ? {} : { "Content-Type": "application/json" },
        body: isFormData ? data : JSON.stringify(data),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error en el registro del agricultor:", error);
      return { status: "ERROR", message: "No se pudo conectar con el servidor" };
    }
  },

  async logout() {
    try {
      await AsyncStorage.removeItem("token");
      console.log("Sesión cerrada correctamente");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  },

  async getToken() {
    try {
      const token = await AsyncStorage.getItem("token");
      return token;
    } catch (error) {
      console.error("Error al obtener el token:", error);
      return null;
    }
  },

  //Devuelve el payload del JWT actual o null si no hay token / está caducado.
  //Lo usan las pantallas que necesitan saber quién es el usuario logueado
  //(checkout, mis pedidos, popup del agricultor, etc.).
  async getCurrentUser() {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return null;
      const decoded = jwtDecode(token);
      if (decoded.exp && decoded.exp < Date.now() / 1000) return null;
      return {
        id: decoded.id ?? null,
        email: decoded.email ?? null,
        role: decoded.role ?? null,
      };
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  },

  async checkToken() {
    try {
      //si el token ha caducado, eliminarlo
      const token = await AsyncStorage.getItem("token");
      if (token) {
        let tokenDecoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (tokenDecoded.exp < currentTime) {
          //si el token está caducado
          await AsyncStorage.removeItem("token");
          return false;
        }

        return true;
      }
    } catch (error) {
      console.error("Error al verificar el token:", error);
      return false;
    }
  },
};

export default authService;
