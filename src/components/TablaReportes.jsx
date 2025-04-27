import React, { useEffect, useState } from 'react';
import { getAllCategories } from '../services/requests/categories';
import { BsPencilSquare, BsEye } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const CategoriaTable = () => {
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState('');


  const fetchReportes = async () => {
    try {
      const data = await getAllCategories();
      const filtrados = data.filter(c => c.name && c.name.trim() !== '');
      setCategorias(filtrados);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  };

  useEffect(() => {
    fetchReportes();
  }, []);

  // Filtrado dinámico por nombre (puedes ampliar a otro dato si quieres)
  const categoriasFiltrados = categorias.filter(cat =>
    cat.name.toLowerCase().includes(busqueda.toLowerCase())
  );


  return (
    <div className="">
      <h3>Reportes Diarios</h3>
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
              <th>Dia</th>
              <th>Total en ventas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categoriasFiltrados.length > 0 ? (
              categoriasFiltrados.map((cat) => (
                <tr key={cat.id} className=''>
                  <td>25</td>
                  <td>$ 2'500.600</td>
                  <td>
                    <Link to={`/reportes/detalle/2025-04-27`} className="btn mb-0 bg-info text-sm text-white btn-sm">
                    <BsEye/> detalles
                    </Link>
                    
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
