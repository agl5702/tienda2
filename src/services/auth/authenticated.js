import { fetchData } from "@/services/api.js";

export const authenticatedUser = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token no disponible.");
  }

  // Pasamos el token directamente como string, no como objeto de headers
  return fetchData("GET", "/users/me/", null, token);
};
