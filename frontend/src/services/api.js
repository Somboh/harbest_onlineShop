import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Platform } from "react-native";

//URL base del backend. Se configura en app.json → expo.extra.apiBaseUrl.
//Para desarrollo en local: http://localhost:3000
//Para móvil real (Expo Go en un dispositivo), `localhost` apunta al teléfono;
//hay que poner la IP de tu PC en la LAN (ej: http://192.168.1.42:3000).
export const API_BASE_URL = /*Constants.expoConfig?.extra?.apiBaseUrl ??*/ /*"https://harbest-onlineshop.onrender.com"*/ "http://localhost:3000";

const buildHeaders = async (extra = {}, withAuth = false) => {
  const headers = { "Content-Type": "application/json", ...extra };
  if (withAuth) {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  return headers;
};

const handleResponse = async (res) => {
  let body = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  if (!res.ok) {
    const message = body?.message ?? `Error ${res.status}`;
    throw new Error(Array.isArray(message) ? message.join(", ") : message);
  }
  return body;
};

export const api = {
  async get(path, { auth = false } = {}) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "GET",
      headers: await buildHeaders({}, auth),
    });
    return handleResponse(res);
  },

  async post(path, data, { auth = false } = {}) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: await buildHeaders({}, auth),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async put(path, data, { auth = false } = {}) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "PUT",
      headers: await buildHeaders({}, auth),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async patch(path, data, { auth = false } = {}) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "PATCH",
      headers: await buildHeaders({}, auth),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async delete(path, { auth = false } = {}) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "DELETE",
      headers: await buildHeaders({}, auth),
    });
    return handleResponse(res);
  },

  //para multipart/form-data (subida de imágenes). No usa Content-Type manual,
  //fetch lo añade con el boundary correcto a partir del FormData.
  async postForm(path, formData, { auth = false } = {}) {
    const headers = {};
    if (auth) {
      const token = await AsyncStorage.getItem("token");
      if (token) headers.Authorization = `Bearer ${token}`;
    }
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers,
      body: formData,
    });
    return handleResponse(res);
  },

  async putForm(path, formData, { auth = false } = {}) {
    const headers = {};
    if (auth) {
      const token = await AsyncStorage.getItem("token");
      if (token) headers.Authorization = `Bearer ${token}`;
    }
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "PUT",
      headers,
      body: formData,
    });
    return handleResponse(res);
  },
};

export default api;
