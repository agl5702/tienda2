import React, { useEffect, useState } from 'react';
import { getAllCategories, deleteCategory } from '../services/requests/categories';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const CategoriaTable = () => {
  const [categorias, setCategorias] = useState([]);

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

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar esta categoría?')) {
      try {
        await deleteCategory(id);
        fetchCategorias();
      } catch (error) {
        console.error('Error al eliminar categoría:', error);
      }
    }
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-striped">
        <thead className="table bg-gradient-dark text-white">
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.length > 0 ? (
            categorias.map((cat) => (
              <tr key={cat.id} className=''>
                <td>{cat.name}</td>
                <td>{cat.description}</td>
                <td>
                  <Link to={`/categorias/editar/${cat.id}`} className="btn mb-0 bg-info text-sm text-white btn-sm">
                   <BsPencilSquare/> Editar
                  </Link>
                  <button onClick={() => handleDelete(cat.id)}  className="btn mb-0 btn-dark text-sm btn-sm ms-2">
                   <BsTrash /> Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">No hay categorías.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriaTable;
