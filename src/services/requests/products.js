import {fetchData} from "@/services/api.js"

// Funciones específicas (Opcional)
export const getAllCategories = async () => {
  return fetchData("GET", "/categories/");
};

export const getAllProducts = async ()=>{
  return fetchData("GET","/products/")
}