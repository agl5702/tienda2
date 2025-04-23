import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts, deleteProduct } from '../services/requests/products';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import { MdDelete } from "react-icons/md";

const VentaTable = () => {
  const [productos, setProductos] = useState([]);

  const fetchProductos = async () => {
    try {
      const data = await getAllProducts();
      setProductos(data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar este producto?')) {
      try {
        await deleteProduct(id);
        fetchProductos(); // Actualiza la lista
      } catch (error) {
        console.error('Error al eliminar producto:', error);
      }
    }
  };

  const calcularPrecioVenta = (producto) => {
    if (producto.purchase_price && producto.profit_percentage !== undefined) {
      return (producto.purchase_price * (1 + producto.profit_percentage / 100)).toFixed(2);
    }
    return '0.00';
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-striped">
        <thead className="table bg-gradient-dark text-white">
          <tr>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Unidad</th>
            <th>Compra</th>
            <th>% Ganancia</th>
            <th>Venta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.length > 0 ? (
            productos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.name}</td>
                <td>{producto.category?.name || 'Sin categoría'}</td>
                <td>{producto.unit || '---'}</td>
                <td>${producto.purchase_price?.toFixed(2)}</td>
                <td>{producto.profit_percentage}%</td>
                <td>${calcularPrecioVenta(producto)}</td>
                <td>
                  <Link to={`/productos/editar/${producto.id}`} className="btn mb-0 bg-info text-sm text-white btn-sm">
                  <BsPencilSquare/> Editar
                  </Link>
                  <button onClick={() => handleDelete(producto.id)} className="btn mb-0 btn-dark text-sm btn-sm ms-2">
                  <BsTrash /> Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">No hay productos.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VentaTable;
