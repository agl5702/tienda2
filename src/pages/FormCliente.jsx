import React, { useEffect, useState } from 'react';
import { createOneCustomer, getCustomerById, updateCustomer } from '../services/requests/customers.js';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from "../components/Sidebar.jsx";



const FormCustomer = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState([]);
  const navigate = useNavigate();

  const esEdicion = Boolean(id);

  useEffect(() => {
    if (esEdicion) {
      getCustomerById(id).then(data => {
        setCustomer(data);
      }).catch(err => {
        console.error('Error al cargar Cliente', err);
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (esEdicion) {
        await updateCustomer(id, customer);
      } else {
        await createOneCustomer(customer);
      }
      navigate('/clientes');
    } catch (error) {
      console.error('Error al guardar Cliente', error);
    }
  };

  return (
    <>
    <div className="m-0" style={{ paddingLeft: "4.5rem" }}>

<Sidebar />

<div className="col p-2" style={{ minHeight: "100vh" }}>
    <div className="card p-2">
    <h2>{esEdicion ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>

        <form onSubmit={handleSubmit}>

          <div className="row m-0">
            <div className="col-12 col-md-6">
              <div className="form-group mt-2">
                <label className='mb-n3'>Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={customer.name}
                  onChange={handleChange}
                  className="form-control border ps-2"
                  required
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group mt-2">
                <label className='mb-n3'>Alias</label>
                <input
                  type="text"
                  name="alias"
                  value={customer.alias}
                  onChange={handleChange}
                  className="form-control border ps-2"
                  required
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group mt-2">
                <label className='mb-n3'>Cédula</label>
                <input
                  type="number"
                  name="cc"
                  value={customer.cc}
                  onChange={handleChange}
                  className="form-control border ps-2"
                  required
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group mt-2">
                <label className='mb-n3'>Teléfono</label>
                <input
                  type="number"
                  name="phone"
                  value={customer.phone}
                  onChange={handleChange}
                  className="form-control border ps-2"
                  required
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group mt-2">
                <label className='mb-n3'>Dirección</label>
                <input
                  type="text"
                  name="direction"
                  value={customer.direction}
                  onChange={handleChange}
                  className="form-control border ps-2"
                  required
                />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="form-group mt-2">
                <label className='mb-n3'>Dirección</label>
                <input
                  type="text"
                  name="direction"
                  value={customer.avatar}
                  onChange={handleChange}
                  className="form-control border ps-2"
                  required
                />
              </div>
            </div>
            <div className="col-12 col-md-6 mt-2">
              <div className="card border px-4 py-2">
              <label className="text-center">Selecciona un avatar</label>
                <div className="row justify-content-center">
                  {[ 5, 4, 1, 2, 3, 7, 8, 9].map((num) => {
                    const filename = `Recurso${num}.png`;
                    const isSelected = customer.avatar === filename;
                    return (
                      <img
                        key={num}
                        src={`/img/avatars/${filename}`}
                        alt={`Avatar ${num}`}
                        onClick={() => setCustomer(prev => ({ ...prev, avatar: `/img/avatars/${filename}` }))}
                        style={{
                          width: '80px',
                          height: '80px',
                          cursor: 'pointer',
                          border: isSelected ? '3px solid #17a2b8' : '2px solid #ccc',
                          borderRadius: '50%',
                          padding: '2px',
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            
          </div>
          </div>

          


          <div className="text-center py-2 mt-2">
          <button type="button" className="btn btn-secondary mb-0" onClick={() => navigate('/clientes')}>
              Cancelar
            </button>
            <button type="submit" className="btn bg-info mb-0 ms-2 text-white">
              {esEdicion ? 'Actualizar' : 'Crear'}
            </button>
            
          </div>

          
        </form>
        
    </div>
</div>

</div>
    </>

    
  );
};

export default FormCustomer;
