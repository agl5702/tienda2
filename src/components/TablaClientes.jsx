import React, { useEffect, useState } from 'react';
import { getAllCustomers, deleteCustomer } from '../services/requests/customers';
import { Link } from 'react-router-dom';

const CategoriaTable = () => {
  const [customers, setCustomers] = useState([]);

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
    if (confirm('¿Eliminar este cliente?')) {
      try {
        await deleteCustomer(id);
        fetchCustomers();
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
      }
    }
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-striped">
        <thead className="table bg-gradient-dark text-white">
          <tr>
            <th>Nombre</th>
            <th>Documento</th>
            <th>Celular</th>
            <th>Direccion</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {customers.length > 0 ? (
            customers.map((customer) => (
              <tr key={customer.id} className=''>
                <td>{customer.name} "{customer.alias}"</td>
                <td>{customer.cc}</td>
                <td>{customer.phone}</td>
                <td>{customer.direction}</td>
                <td>
                  <Link to={`/cliente/editar/${customer.id}`} className="btn mb-0 btn-warning btn-sm">
                    Editar
                  </Link>
                  <button onClick={() => handleDelete(customer.id)} className="btn mb-0 btn-danger btn-sm ms-2">
                    Eliminar
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
