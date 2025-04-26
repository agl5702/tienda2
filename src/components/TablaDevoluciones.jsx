import React, { useEffect, useState } from 'react';
import { getAllReturns, deleteReturn } from '../services/requests/returns';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const ReturnTable = () => {
  const [returns, setReturns] = useState([]);
  const [busqueda, setBusqueda] = useState('');


  const fetchReturns = async () => {
    try {
      const data = await getAllReturns();
      setReturns(data);
    } catch (error) {
      console.error('Error al obtener devolución:', error);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar esta devolución?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await deleteReturn(id);
        fetchReturns();
        Swal.fire('Eliminada', 'La devolución fue eliminada correctamente', 'success');
      } catch (error) {
        console.error('Error al eliminar devolución:', error);
        Swal.fire('Error', 'Hubo un problema al eliminar la devolución', 'error');
      }
    }
  };

  // Filtrado dinámico por nombre (puedes ampliar a otro dato si quieres)
  const returnsFiltrados = returns.filter(value =>
    value.return_date.toLowerCase().includes(busqueda.toLowerCase())
  );


  return (
    <div className="">
      <div className="my-2 col-12 col-sm-6 col-md-5 col-lg-4 col-xl-3">
        <input
          type="text"
          className="form-control border border-2 ps-3"
          placeholder="🔍 Buscar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table bg-gradient-dark text-white">
            <tr>
              <th>Fecha</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {returnsFiltrados.length > 0 ? (
              returnsFiltrados.map((value) => (
                <tr key={value.id} className=''>
                  <td>{value.return_date}</td>
                  <td>{value.amount_returned}</td>
                  <td>
                    <Link to={`/devolucion/editar/${value.id}`} className="btn mb-0 bg-info text-sm text-white btn-sm">
                    <BsPencilSquare/> Editar
                    </Link>
                    <button onClick={() => handleDelete(value.id)}  className="btn mb-0 btn-dark text-sm btn-sm ms-2">
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

export default ReturnTable;
