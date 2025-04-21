import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts, deleteProduct, updateProduct } from '../services/requests/products';
import { getAllCategories } from '../services/requests/categories';

const VentaTable = () => {
  const [campoFiltro, setCampoFiltro] = useState('general');
  const [valorFiltro, setValorFiltro] = useState('');
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await getAllProducts();
      setProductos(response);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategorias(response);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const calcularPrecioVenta = (producto) => {
    if (producto.purchase_price && producto.profit_percentage !== undefined) {
      return producto.purchase_price * (1 + producto.profit_percentage / 100);
    }
    return 0;
  };

  const calcularPorcentajeGanancia = (producto) => {
    if (producto.purchase_price && producto.sale_price) {
      return ((producto.sale_price - producto.purchase_price) / producto.purchase_price) * 100;
    }
    return 0;
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

  const handleDelete = () => {
    if (productoSeleccionado) {
      deleteProduct(productoSeleccionado.id)
        .then(() => {
          setProductos((prevProducts) => prevProducts.filter((product) => product.id !== productoSeleccionado.id));
          setShowDeleteModal(false);
        })
        .catch((error) => {
          console.error("Error al eliminar producto:", error);
        });
    }
  };

  const handleDeleteConfirmation = (producto) => {
    setProductoSeleccionado(producto);
    setShowDeleteModal(true);
  };

  const handleEditProduct = (producto) => {
    setProductoSeleccionado(producto);
    setCategoriaSeleccionada(producto.category?.id || '');  // Establecer la categoría seleccionada
    setShowEditModal(true);
  };

  const handleInputChange = (e, field) => {
    const { value } = e.target;
    setProductoSeleccionado((prevProducto) => {
      const updatedProducto = { ...prevProducto, [field]: value };

      if (field === 'purchase_price') {
        updatedProducto.sale_price = calcularPrecioVenta(updatedProducto);
        updatedProducto.profit_percentage = calcularPorcentajeGanancia(updatedProducto);
      }
      if (field === 'sale_price') {
        updatedProducto.profit_percentage = calcularPorcentajeGanancia(updatedProducto);
      }
      if (field === 'profit_percentage') {
        updatedProducto.sale_price = calcularPrecioVenta(updatedProducto);
      }

      return updatedProducto;
    });
  };

  const handleSaveChanges = async () => {
    if (productoSeleccionado) {
      try {
        // Asegurarse de que se actualice la categoría seleccionada
        productoSeleccionado.category_id = categoriaSeleccionada;

        await updateProduct(productoSeleccionado.id, productoSeleccionado);
        setShowEditModal(false);
        loadProducts();
      } catch (error) {
        console.error('Error al guardar cambios:', error);
      }
    }
  };

  const unidades = ['UNIDAD', 'GRAMOS', 'KILOGRAMOS', 'MILILITROS', 'LITROS', 'METROS'];

  return (
    <div className="container mt-4">
      <div className="d-flex">
        <h3>Listado de Productos</h3>
        <div className="col text-end">
          <Link to="/form_producto" className="btn text-white btn-sm mt-2 mb-0 bg-info">Nuevo producto</Link>
        </div>
      </div>

      {/* Filtro */}
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

      {/* Tabla de productos */}
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
                  <td>${calcularPrecioVenta(producto).toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEditProduct(producto)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm ms-2"
                      onClick={() => handleDeleteConfirmation(producto)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No se encontraron productos</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de edición */}
      {showEditModal && (
        <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Producto</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      value={productoSeleccionado.name}
                      onChange={(e) => handleInputChange(e, 'name')}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Categoría</label>
                    <select
                      className="form-select"
                      value={categoriaSeleccionada}
                      onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                    >
                      {categorias.map((categoria, index) => (
                        <option key={index} value={categoria.id}>{categoria.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Precio de compra</label>
                    <input
                      type="number"
                      className="form-control"
                      value={productoSeleccionado.purchase_price}
                      onChange={(e) => handleInputChange(e, 'purchase_price')}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Porcentaje de ganancia</label>
                    <input
                      type="number"
                      className="form-control"
                      value={productoSeleccionado.profit_percentage}
                      onChange={(e) => handleInputChange(e, 'profit_percentage')}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Precio de venta</label>
                    <input
                      type="number"
                      className="form-control"
                      value={productoSeleccionado.sale_price}
                      onChange={(e) => handleInputChange(e, 'sale_price')}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cerrar</button>
                <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>Guardar cambios</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de eliminación */}
      {showDeleteModal && (
        <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmación de eliminación</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que deseas eliminar este producto?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VentaTable;
