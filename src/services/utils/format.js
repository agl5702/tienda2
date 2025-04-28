// utils/format.js

export function formatCurrency(value) {
    if (typeof value !== 'number') {
      value = Number(value) || 0;
    }
  
    return value.toLocaleString('es-ES', {
      style: 'currency',
      currency: 'COP', // O puedes cambiarlo a 'USD', 'MXN', etc. según tu necesidad
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  