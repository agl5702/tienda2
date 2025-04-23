import React, { useEffect, useState } from 'react';
import { getAllCategories, deleteCategory } from '../services/requests/categories';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const CategoriaTable = () => {
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState('');


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
    const result = await Swal.fire({
      title: '¿Eliminar esta categoria?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await deleteCategory(id);
        fetchCategorias();
        Swal.fire('Eliminada', 'La categoria fue eliminada correctamente', 'success');
      } catch (error) {
        console.error('Error al eliminar categoría:', error);
        Swal.fire('Error', 'Hubo un problema al eliminar la categoria', 'error');
      }
    }
  };

  // Filtrado dinámico por nombre (puedes ampliar a otro dato si quieres)
  const categoriasFiltrados = categorias.filter(cat =>
    cat.name.toLowerCase().includes(busqueda.toLowerCase())
  );


  return (
    <div className="">
      <div className="my-2 col-12 col-sm-6 col-md-5 col-lg-4 col-xl-3">
        <input
          type="text"
          className="form-control border border-2 ps-3"
          placeholder="🔍 Buscar categoria por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

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
            {categoriasFiltrados.length > 0 ? (
              categoriasFiltrados.map((cat) => (
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
                <td colSpan="3" className="text-center">No hay Datos.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    
  );
};

export default CategoriaTable;
