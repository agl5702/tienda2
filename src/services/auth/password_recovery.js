import {fetchData} from "@/services/api.js"

// Crear una nueva categoría
export const passwordRecovery = async (data) => {
    const response = await fetchData("POST", "/auth/password-recovery/", data);
  return response;
  };
  