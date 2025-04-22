import React, { useEffect, useState } from 'react';
import { createOneCategory, getCategoryById, updateCategory } from '../services/requests/categories';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from "../components/Sidebar.jsx";



const FormCategoria = () => {
  const { id } = useParams();
  const [categoria, setCategoria] = useState({ name: '', description: '' });
  const navigate = useNavigate();

  const esEdicion = Boolean(id);

  useEffect(() => {
    if (esEdicion) {
      getCategoryById(id).then(data => {
        setCategoria({ name: data.name, description: data.description });
      }).catch(err => {
        console.error('Error al cargar categoría', err);
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoria(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (esEdicion) {
        await updateCategory(id, categoria);
      } else {
        await createOneCategory(categoria);
      }
      navigate('/categorias');
    } catch (error) {
      console.error('Error al guardar categoría', error);
    }
  };

  return (
    <>
    <div className="m-0" style={{ paddingLeft: "4.5rem" }}>

<Sidebar />

<div className="col p-2" style={{ minHeight: "100vh" }}>
    <div className="card p-2">
    <h2>{esEdicion ? 'Editar Categoría' : 'Nueva Categoría'}</h2>

        <form onSubmit={handleSubmit}>

          <div className="row m-0">
            <div class="col-12 col-md-6">
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={categoria.name}
                  onChange={handleChange}
                  className="form-control border ps-2"
                  required
                />
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="input-group input-group-static my-2">
              <label>Descripción</label>
              <textarea
                name="description"
                value={categoria.description}
                onChange={handleChange}
                className="form-control"
                required
              />
              </div>
            </div>
          </div>

          <div className="text-center py-2">
          <button type="button" className="btn btn-secondary mb-0" onClick={() => navigate('/categorias')}>
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

export default FormCategoria;
