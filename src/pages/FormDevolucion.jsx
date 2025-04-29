import React, { useEffect, useState } from 'react';
import { createOneReturn, getReturnById, updateReturn } from '../services/requests/returns.js';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from "../components/Sidebar.jsx";
import MenuMovil from "../components/MenuMovil.jsx";



const FormReturns = () => {
  const { id } = useParams();
  const [returns, setReturn] = useState({ amount_returned: ''});
  const navigate = useNavigate();

  const esEdicion = Boolean(id);

  useEffect(() => {
    if (esEdicion) {
      getReturnById(id).then(data => {
        setReturn({ amount_returned: data.amount_returned});
      }).catch(err => {
        console.error('Error al cargar devolucion', err);
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReturn(prev => ({ ...prev, [name]: value }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (esEdicion) {
        await updateReturn(id, returns);
      } else {
        await createOneReturn(returns);
      }
      navigate('/devoluciones');
    } catch (error) {
      console.error('Error al guardar devolucion', error);
    }
  };

  return (
    <>
    <div className="m-0 padding-menu">

<Sidebar />
        <MenuMovil />

<div className="col p-2" style={{ minHeight: "100vh" }}>
    <div className="card p-2">
    <h3>{esEdicion ? 'Editar Devolución' : 'Nueva Devolución'}</h3>

        <form onSubmit={handleSubmit}>

          <div className="row m-0">
            <div className="col-12 col-md-6 mx-auto">
              <div className="form-group">
                <label>Valor de la devolucion</label>
                <input
                  type="number"
                  name="amount_returned"
                  value={returns.amount_returned}
                  onChange={handleChange}
                  className="form-control border ps-2"
                  required
                />
              </div>
            </div>
          </div>

          <div className="text-center py-2">
          <button type="button" className="btn btn-secondary mb-0" onClick={() => navigate('/devoluciones')}>
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

export default FormReturns;
