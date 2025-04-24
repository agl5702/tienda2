import React, { useEffect, useState } from 'react';
import { getAllCustomers, deleteCustomer } from '../services/requests/customers';
import { Link } from 'react-router-dom';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import Swal from 'sweetalert2';

const CategoriaTable = () => {
  const [customers, setCustomers] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  const fetchCustomers = async () => {
    try {
      const data = await getAllCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar este cliente?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (result.isConfirmed) {
      try {
        await deleteCustomer(id);
        fetchCustomers();
        Swal.fire('Eliminado', 'El cliente fue eliminado correctamente', 'success');
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
        Swal.fire('Error', 'Hubo un problema al eliminar el cliente', 'error');
      }
    }
  };

  // Filtrado dinámico por nombre (puedes ampliar a categoría si quieres)
  const customersFiltrados = customers.filter(customer =>
    customer.name.toLowerCase().includes(busqueda.toLowerCase())||
    customer.alias?.toLowerCase().includes(busqueda.toLowerCase())
  );


  return (
    <div className="">
      <div className="my-2 col-12 col-sm-6 col-md-5 col-lg-4 col-xl-3">
        <input
          type="text"
          className="form-control border border-2 ps-3"
          placeholder="🔍 Buscar clientes por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>
      <div className="row">
        {customersFiltrados.length > 0 ? (
          customersFiltrados.map((customer) => (
            <div key={customer.id} className="col-xl-4 col-sm-6 mb-2">
              <div className="card border p-2">
                <div className="row">
                  <div className="col-lg-4 col-md-4 text-center my-auto">
                    <img className="avatar avatar-xl border-radius-lg" src="https://w7.pngwing.com/pngs/312/283/png-transparent-man-s-face-avatar-computer-icons-user-profile-business-user-avatar-blue-face-heroes-thumbnail.png"/>
                    <br />
                    <span className="text-xs mb-0">CC. {customer.cc}</span>
                  </div>
                  <div className="col-lg-8 col-md-8 col-sm-12">
                    <div className="text-center text-md-start">
                    <h5 className="my-0">{customer.name}</h5>
                    <p className='m-0 text-xs'>{customer.alias}</p>
                    <p className='m-0 text-xs'>{customer.phone}</p>
                    <p className='m-0 text-xs'>{customer.direction}</p>
                    </div>
                    
                    
                    
                    <div className="d-flex justify-content-center justify-content-md-center justify-content-lg-end mt-2">
                    <Link to={`/cliente/editar/${customer.id}`} className="btn mb-0 bg-info text-sm text-white btn-sm">
                    <BsPencilSquare/> <span className='d-inline d-sm-none d-lg-inline'> Editar</span> 
                    </Link>
                    <button onClick={() => handleDelete(customer.id)} className="btn mb-0 btn-dark text-sm btn-sm ms-2">
                    <BsTrash /> <span className='d-inline d-sm-none d-lg-inline'> Eliminar</span> 
                    </button>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
          ))
          ) : (
              <div className="text-center col-12">No hay datos...</div>
          )}
        </div>
    </div>
  );
};

export default CategoriaTable;
