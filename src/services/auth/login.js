import {fetchData} from "@/services/api.js"

// Crear una nueva categoría
export const loginUser = async (data) => {
    return fetchData("POST", "/auth/login/", data);
  };
  