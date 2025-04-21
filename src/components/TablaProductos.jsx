import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { getAllProducts } from '../services/requests/products';

const VentaTable = () => {
  const [campoFiltro, setCampoFiltro] = useState('general');
  const [valorFiltro, setValorFiltro] = useState('');
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);
  
  const loadProducts = async () => {
    try {
      const productos = await getAllProducts();
      setProductos(productos);
      console.log(productos);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };
  

  const calcularPrecioVenta = (producto) => {
    // Si ya viene el precio de venta, usarlo directamente
    if (producto.sale_price && producto.sale_price > 0) {
      return producto.sale_price;
    }
    const ganancia = producto.purchase_price * (producto.profit_percentage / 100);
    return producto.purchase_price + ganancia;
  };

  const productosFiltrados = productos.filter((producto) => {
    const valor = valorFiltro.toLowerCase();

    if (!valorFiltro) return true;

    const nombre = producto.name?.toLowerCase() || '';
    const categoria = producto.category?.name?.toLowerCase() || '';
    const unidadMedida = producto.unit || '';

    if (campoFiltro === 'general') {
      return (
        nombre.includes(valor) ||
        categoria.includes(valor) ||
        unidadMedida.includes(valor) ||
        producto.purchase_price?.toString().includes(valor) ||
        producto.profit_percentage?.toString().includes(valor) ||
        calcularPrecioVenta(producto)?.toString().includes(valor)
      );
    }

    switch (campoFiltro) {
      case 'nombre':
        return nombre.includes(valor);
      case 'categoria':
        return categoria.includes(valor);
      case 'precioCompra':
        return producto.purchase_price === parseFloat(valor);
      case 'porcentajeGanancia':
        return producto.profit_percentage === parseInt(valor);
      case 'precioVenta':
        return calcularPrecioVenta(producto) === parseFloat(valor);
      default:
        return true;
    }
  });

  return (
    <div className="container mt-4">
      <div className="d-flex">
        <h3>Listado de Productos</h3>
        <div className="col text-end">
          <Link to="/form_producto" className="btn text-white btn-sm mt-2 mb-0 bg-info">Nuevo producto</Link>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control border ps-2"
            placeholder={`Buscar por ${campoFiltro === 'general' ? 'cualquier campo' : campoFiltro}...`}
            value={valorFiltro}
            onChange={(e) => setValorFiltro(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select className="form-select border ps-2" value={campoFiltro} onChange={(e) => setCampoFiltro(e.target.value)}>
            <option value="general">🔍 General</option>
            <option value="nombre">🏷️ Nombre</option>
            <option value="categoria">📂 Categoría</option>
            <option value="precioCompra">💲 Precio de Compra</option>
            <option value="porcentajeGanancia">📈 % Ganancia</option>
            <option value="precioVenta">💰 Precio de Venta</option>
          </select>
        </div>
      </div>

      <table className="table table-bordered table-striped">
        <thead className="table bg-gradient-dark text-white">
          <tr>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Unidad</th>
            <th>Compra</th>
            <th>% Ganancia</th>
            <th>Venta</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.name}</td>
                <td>{producto.category?.name || 'Sin categoría'}</td>
                <td>{producto.unit || '---'}</td>
                <td>${producto.purchase_price?.toFixed(2)}</td>
                <td>{producto.profit_percentage}%</td>
                <td>${calcularPrecioVenta(producto).toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No se encontraron productos</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VentaTable;
