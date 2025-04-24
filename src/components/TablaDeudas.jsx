import React, { useEffect, useState } from 'react';
import { getAllCustomers, deleteCustomer } from '../services/requests/customers';
import { Link } from 'react-router-dom';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import { FaRegEye } from "react-icons/fa";

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
    if (confirm('¿Eliminar este cliente?')) {
      try {
        await deleteCustomer(id);
        fetchCustomers();
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
      }
    }
  };

  // Filtrado dinámico por nombre (puedes ampliar a categoría si quieres)
  const customersFiltrados = customers.filter(customer =>
    customer.name.toLowerCase().includes(busqueda.toLowerCase())
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
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table bg-gradient-dark text-white">
            <tr>
              <th>Nombre del cliente</th>
              <th>Valor total</th>
              <th>Ultima fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {customersFiltrados.length > 0 ? (
              customersFiltrados.map((customer) => (
                <tr key={customer.id} className=''>
                  <td>{customer.name} "{customer.alias}"</td>
                  <td>{customer.cc}</td>
                  <td>{customer.direction}</td>
                  <td>
                    <Link to={`/cliente/editar/${customer.id}`} className="btn mb-0 bg-info text-sm text-white btn-sm">
                    <BsPencilSquare/> accion
                    </Link>
                    <button className="btn mb-0 btn-dark text-sm btn-sm ms-2">
                    <FaRegEye /> detalles
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No hay deudas por mostrar en este momento... 💸</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriaTable;
