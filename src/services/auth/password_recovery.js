// services/auth/password_recovery.js
import { fetchData } from "@/services/api.js";

export const passwordRecovery = async (data) => {
  try {
    const response = await fetchData("POST", "/auth/password-recovery/", data);
    return response;
  } catch (error) {
    // Si hay error, lo lanzamos para que lo capture el componente
    throw error;
  }
};