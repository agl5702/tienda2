import { fetchData } from "@/services/api.js";

export const logoutUser = async (token) => {
  return fetchData("POST", "/auth/logout", null, token); 
};