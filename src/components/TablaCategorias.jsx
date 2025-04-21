import React, { useEffect, useState } from 'react';
import { getAllCategories, createOneCategory, deleteCategory, updateCategory } from '../services/requests/categories';

const CategoriaTable = () => {
  const [categorias, setCategorias] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState({ name: '', description: '' });
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null); // Estado para la categoría a eliminar

  const fetchCategorias = async () => {
    try {
      const data = await getAllCategories();
      setCategorias(data);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaCategoria({ ...nuevaCategoria, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createOneCategory(nuevaCategoria);
      setNuevaCategoria({ name: '', description: '' });
      setMostrarFormulario(false);
      fetchCategorias(); // Actualizar lista
    } catch (error) {
      console.error('Error al crear categoría:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCategory(categoriaAEliminar.id);
      setCategoriaAEliminar(null); // Cerrar modal después de eliminar
      fetchCategorias(); // Refrescar lista
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
    }
  };

  const handleEdit = async (id, data) => {
    try {
      await updateCategory(id, data);
      setCategoriaEditando(null); // Cerrar formulario de edición
      fetchCategorias(); // Actualizar lista
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
    }
  };

  return (
    <div className="container mt-4">
      <div>
        <h3>Lista de Categorías</h3>

        <button
          className="btn btn-success mb-3"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? 'Cancelar' : 'Nueva Categoría'}
        </button>

        {mostrarFormulario && (
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="name"
                value={nuevaCategoria.name}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <textarea
                name="description"
                value={nuevaCategoria.description}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Guardar</button>
          </form>
        )}

        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.length > 0 ? (
                categorias.map((categoria) => (
                  <tr key={categoria.id}>
                    <td>{categoria.name}</td>
                    <td>{categoria.description}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => setCategoriaEditando(categoria)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger btn-sm ml-2"
                        onClick={() => setCategoriaAEliminar(categoria)} // Abre el modal
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">No hay categorías disponibles.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formulario de edición de categoría */}
        {categoriaEditando && (
        <div className="modal" style={{ display: 'block' }}>
            <div className="modal-dialog modal-lg">
            <div className="modal-content">
                <h4 className="modal-title">Editar Categoría</h4>
                <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleEdit(categoriaEditando.id, categoriaEditando);
                }}
                >
                <div className="form-group">
                    <label>Nombre</label>
                    <input
                    type="text"
                    name="name"
                    value={categoriaEditando.name}
                    onChange={(e) => setCategoriaEditando({ ...categoriaEditando, name: e.target.value })}
                    className="form-control"
                    required
                    />
                </div>
                <div className="form-group">
                    <label>Descripción</label>
                    <textarea
                    name="description"
                    value={categoriaEditando.description}
                    onChange={(e) => setCategoriaEditando({ ...categoriaEditando, description: e.target.value })}
                    className="form-control"
                    required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Actualizar</button>
                <button
                    type="button"
                    className="btn btn-secondary ml-2"
                    onClick={() => setCategoriaEditando(null)}
                >
                    Cancelar
                </button>
                </form>
            </div>
            </div>
        </div>
        )}

      {/* Modal de confirmación de eliminación */}
      {categoriaAEliminar && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar eliminación</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setCategoriaAEliminar(null)} // Cerrar modal
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que deseas eliminar la categoría "{categoriaAEliminar.name}"?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setCategoriaAEliminar(null)} // Cerrar modal
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete} // Eliminar categoría
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriaTable;
