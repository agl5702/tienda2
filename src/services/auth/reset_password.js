import {fetchData} from "@/services/api.js"

// Crear una nueva categoría
export const resetPassword = async (data) => {
    return fetchData("POST", "/auth/reset-password/", data);
  };
  