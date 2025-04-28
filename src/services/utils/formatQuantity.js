export const formatQuantity = (cantidad) => {
    return new Intl.NumberFormat('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 3 }).format(cantidad);
  };
  