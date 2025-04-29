import {fetchData} from "@/services/api.js"

// Crear una nueva categoría
export const registerUser = async (data) => {
    return fetchData("POST", "/users/", data);
  };
  