// src/utils/format.js

/**
 * Formatea un valor numérico como moneda COP
 * @param {number} value - Valor a formatear
 * @param {number} decimals - Número de decimales (por defecto 0)
 * @returns {string} Valor formateado como moneda
 */
export const formatCurrency = (value, decimals = 0) => {
    if (isNaN(value)) return '$0';
    
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value || 0);
  };
  
  /**
   * Formatea una fecha a formato local
   * @param {string|Date} date - Fecha a formatear
   * @param {boolean} includeTime - Incluir hora (opcional)
   * @returns {string} Fecha formateada
   */
  export const formatDate = (date, includeTime = false) => {
    if (!date) return '';
    
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...(includeTime && {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    
    return new Date(date).toLocaleDateString('es-CO', options);
  };
  
  /**
   * Formatea un número con separadores de miles
   * @param {number} value - Valor a formatear
   * @param {number} decimals - Decimales a mostrar
   * @returns {string} Número formateado
   */
  export const formatNumber = (value, decimals = 0) => {
    if (isNaN(value)) return '0';
    
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value || 0);
  };
  
  /**
   * Formatea cantidades de productos (unidades)
   * @param {number} quantity - Cantidad a formatear
   * @returns {string} Cantidad formateada
   */
  export const formatQuantity = (quantity) => {
    if (isNaN(quantity)) return '0';
    
    // Si es entero, mostrar sin decimales
    if (Number.isInteger(quantity)) {
      return quantity.toString();
    }
    
    // Mostrar con 1 decimal si tiene parte decimal
    return quantity.toFixed(1).replace('.', ',');
  };
  
  /**
   * Acorta texto largo agregando puntos suspensivos
   * @param {string} text - Texto a acortar
   * @param {number} maxLength - Longitud máxima
   * @returns {string} Texto acortado
   */
  export const shortenText = (text, maxLength = 50) => {
    if (!text) return '';
    return text.length > maxLength 
      ? `${text.substring(0, maxLength)}...` 
      : text;
  };
  
  /**
   * Formatea porcentajes
   * @param {number} value - Valor porcentual (ej. 0.5 para 50%)
   * @param {number} decimals - Decimales a mostrar
   * @returns {string} Porcentaje formateado
   */
  export const formatPercent = (value, decimals = 1) => {
    if (isNaN(value)) return '0%';
    
    const percentValue = value * 100;
    return `${new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(percentValue)}%`;
  };
  
  export default {
    formatCurrency,
    formatDate,
    formatNumber,
    formatQuantity,
    shortenText,
    formatPercent
  };