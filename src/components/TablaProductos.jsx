import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts, deleteProduct } from '../services/requests/products';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import Swal from 'sweetalert2';


const VentaTable = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');

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
    const result = await Swal.fire({
      title: '¿Eliminar este producto?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await deleteProduct(id);
        fetchProductos();
        Swal.fire('Eliminado', 'El producto fue eliminado correctamente', 'success');
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        Swal.fire('Error', 'Hubo un problema al eliminar el producto', 'error');
      }
    }
  };

  const calcularPrecioVenta = (producto) => {
    if (producto.purchase_price && producto.profit_percentage !== undefined) {
      return (producto.purchase_price * (1 + producto.profit_percentage / 100)).toFixed(2);
    }
    return '0.00';
  };

  // Filtrado dinámico por nombre (puedes ampliar a categoría si quieres)
  const productosFiltrados = productos.filter(producto =>
    producto.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="">
      <div className="my-2 col-12 col-sm-6 col-md-5 col-lg-4 col-xl-3">
        <input
          type="text"
          className="form-control border border-2 ps-3"
          placeholder="🔍 Buscar producto por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>
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
            {productosFiltrados.length > 0 ? (
              productosFiltrados.map((producto) => (
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
    </div>
    
  );
};

export default VentaTable;
