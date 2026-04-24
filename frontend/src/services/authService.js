import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
// const mockUsers = {
//   client: {
//     id: "client-1",
//     name: "Pepe",
//     email: "cliente@harbest.com",
//     role: "client",
//   },
//   farmer: {
//     id: "farmer-1",
//     name: "Jaume",
//     email: "agricultor@harbest.com",
//     role: "farmer",
//   },
// };
const url = "https://harbest-onlineshop.onrender.com";

export const authService = {
  async userLogin(data) {
    try {
      const res = await fetch(`${url}/auth/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const resultado = await res.json();

      if (resultado.accessToken) {
        await AsyncStorage.setItem("token", resultado.accessToken); //token para compruebar si el usuario está logueado
        await AsyncStorage.setItem("role", "user"); //token para comprobar el rol del usuario
        return { status: "OK" };
      } else {
        if (resultado && resultado.status === "ERROR") {
          alert(resultado.message);
          return null;
        } else {
          console.error("Error en token de login:", resultado);
          return null;
        }
        return null;
      }
    } catch (error) {
      console.error("Error en el login:", error);
      return null;
    }
  },

  async farmerLogin(data) {
    try {
      const res = await fetch(`${url}/auth/farmer/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const resultado = await res.json();

      if (resultado.accessToken) {
        await AsyncStorage.setItem("token", resultado.accessToken); //token para compruebar si el usuario está logueado
        await AsyncStorage.setItem("role", "farmer"); //token para comprobar el rol del usuario
        return { status: "OK" };
      } else {
        if (resultado && resultado.status === "ERROR") {
          alert(resultado.message);
          return null;
        } else {
          console.error("Error en token de login:", resultado);
          return null;
        }
        return null;
      }
    } catch (error) {
      console.error("Error en el login:", error);
      return null;
    }
  },

  async userRegister(data) {
    try {
      const response = await fetch(`${url}/auth/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log(result);
      return result;
    } catch (error) {
      console.error("Error en el registro:", error);
      return null;
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
