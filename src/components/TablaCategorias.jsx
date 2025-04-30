import React, { useEffect, useState } from 'react';
import { getAllCategories, deleteCategory } from '../services/requests/categories';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";

const CategoriaTable = () => {
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  
  // Estados para la paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina] = useState(2); // Cantidad de items por página

  const fetchCategorias = async () => {
    try {
      const data = await getAllCategories();
      const filtrados = data.filter(c => c.name && c.name.trim() !== '');
      setCategorias(filtrados);
      // Resetear a página 1 cuando cambian los datos
      setPaginaActual(1);
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

  // Filtrado dinámico por nombre
  const categoriasFiltrados = categorias.filter(cat =>
    cat.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Cálculos para la paginación
  const indiceUltimoItem = paginaActual * itemsPorPagina;
  const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
  const itemsActuales = categoriasFiltrados.slice(indicePrimerItem, indiceUltimoItem);
  const totalPaginas = Math.ceil(categoriasFiltrados.length / itemsPorPagina);

  // Función para cambiar de página
  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
    // Opcional: Scroll hacia arriba de la tabla
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="">
      <div className="my-2 col-12 col-sm-6 col-md-5 col-lg-4 col-xl-3">
        <input
          type="text"
          className="form-control border border-2 ps-3"
          placeholder="🔍 Buscar categoria por nombre..."
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            // Resetear a página 1 cuando se busca
            setPaginaActual(1);
          }}
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
            {itemsActuales.length > 0 ? (
              itemsActuales.map((cat) => (
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

      {/* Componente de Paginación */}
      {categoriasFiltrados.length > itemsPorPagina && (
        <div className="col-12 d-flex justify-content-center mt-3">
          <div className="table-responsive">
            <div className="pagination py-1">
              {/* Botón Anterior */}
              <li className={`page-item bg-white ${paginaActual === 1 ? 'disabled' : ''}`}>
                <button 
                  className={`page-link ${paginaActual === 1 ? 'disabled' : 'text-info border-info'}`}
                  onClick={() => cambiarPagina(paginaActual - 1)}
                  disabled={paginaActual === 1}
                >
                  <AiFillCaretLeft/>
                </button>
              </li>
  
              {/* Números de página */}
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(numero => (
                <div key={numero}>
                  <button 
                    className={`page-link ${paginaActual === numero ? 'bg-info text-white' : 'text-dark'}`}
                    onClick={() => cambiarPagina(numero)}
                    style={{ cursor: 'pointer', borderRadius: '50%', minWidth: '40px', height: '40px' }}
                  >
                    {numero}
                  </button>
                </div>
              ))}
  
              {/* Botón Siguiente */}
              <li className={`page-item ms-1 ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                <button 
                  className={`page-link ${paginaActual === totalPaginas ? 'disabled' : 'text-info border-info'}`}
                  onClick={() => cambiarPagina(paginaActual + 1)}
                  disabled={paginaActual === totalPaginas}
                ><AiFillCaretRight/>
                </button>
              </li>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CategoriaTable;