import React, { useState } from 'react';

const List = ({ productos, onAgregarProducto }) => {
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroCantidadMin, setFiltroCantidadMin] = useState('');
  const [filtroPrecioMax, setFiltroPrecioMax] = useState('');

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
    <div className="col-3 ps-1">
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
      <div style={{ maxHeight: '90vh', overflowY: 'auto', minHeight: '90vh' }}>
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((producto) => (
            <div key={producto.id} className="col-12 col-sm-12 p-2 pb-0">
              <div className="card p-2 text-center">
                <div className="d-flex gap-3">
                  <div>
                  <img
                    src={producto.image_url || 'https://via.placeholder.com/70x60'}
                    alt=""
                    width="70px"
                    height="60px"
                    className="border-radius-lg icon-md-xl"
                  />

                  </div>
                  <div className="w-60 text-start">
                    <p className="m-0">{producto.nombre}</p>
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
  );
};

export default List;
