import React, { useState, useEffect } from 'react';

import './css/Ventas.css';


const List = ({ productos, onAgregarProducto }) => {
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroCantidadMin, setFiltroCantidadMin] = useState('');
  const [filtroPrecioMax, setFiltroPrecioMax] = useState('');

  // Estado para la altura del contenedor
    // Se inicializa con un valor por defecto
  
    const [altura, setAltura] = useState("90vh");
  
    useEffect(() => {
      const handleResize = () => {
        const width = window.innerWidth;
        if (width < 913) {
          setAltura("30vh");
        
        } else {
          setAltura("90vh"); // o lo que quieras por defecto para pantallas grandes
        }
      };
  
      handleResize(); // ejecutar al cargar
      window.addEventListener('resize', handleResize); // escuchar cambios
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
    
    // fin estado altura contenedor

  const limpiarInput = () => {
    setFiltroNombre('');
  };

  const productosFiltrados = productos.filter((producto) => {
    if (!producto || !producto.nombre) return false;

    const coincideNombre = producto.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
    const coincideCantidad = filtroCantidadMin === '' || producto.cantidad >= parseInt(filtroCantidadMin);
    const coincidePrecio = filtroPrecioMax === '' || producto.precio <= parseFloat(filtroPrecioMax);

    return coincideNombre && coincideCantidad && coincidePrecio;
  });

  return (
    <div className="col-md-5 col-lg-4 col-xl-3 ps-2 ps-md-1 pe-2 pe-md-1 border-end bg-gray-300 border-3">
      <div className="px-2">
        <div className="input-group input-group-outline mb-1 mt-2">
          <input
            type="text"
            className="form-control bg-white"
            placeholder="Filtrar por nombre..."
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
          />
          <button onClick={limpiarInput} className="bg-danger btn btn-sm text-white mb-0">x</button>
        </div>
      </div>
      <div className="p-0 list border-bottom border-3 border-radius-2xl p-0 m-0">
        <div className="row m-0" >
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map((producto) => (
              <div key={producto.id} className="col-12 col-sm-6 col-md-12 px-1 pt-1 pb-0">
                <div className="card p-2 text-center">
                  <div className="d-flex gap-3">
                    <div>
                      <img
                        src={producto.image_url || 'https://via.placeholder.com/70x60'}
                        alt=""
                        width="60px"
                        height="50px"
                        className="border-radius-lg icon-md-xl"
                      />
                    </div>
                    <div className="w-60 text-start">
                      <p className="m-0">{producto.nombre} </p>
                      <p className="m-0">${producto.precio}</p>
                    </div>
                    <div className="my-auto">
                      <button className="btn col btn-sm border my-auto border-info text-info"
                        onClick={() => onAgregarProducto(producto)}>+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No se encontraron productos</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default List;
