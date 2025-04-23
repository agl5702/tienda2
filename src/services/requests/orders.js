import {fetchData} from "@/services/api.js"

// Obtener todos los Orders
export const getAllOrders = async ()=>{
  return fetchData("GET","/orders/")
}


// Obtener un Orders por su ID
export const getOrderById = async (id) => {
    return fetchData("GET", `/orders/${id}`);
  };
  
// Crear un nuevo Orders
export const createOrder = async (data) => {
return fetchData("POST", "/orders/", data);
};

// Eliminar un producto
export const deleteOrder = async (id) => {
    return fetchData("DELETE", `/orders/${id}/`);
  };

export const putOrder = async (id, data) => {
  return fetchData("PUT", `/orders/${id}/`, data);
};
  