const VentaForm = ({ productos, onEliminarProducto, onActualizarCantidad, cliente, clientes, setClienteSeleccionado, setClienteBuscado, clienteBuscado }) => {
  const calcularSubtotal = (producto) => producto.precio * producto.cantidad;

  // Asegurarnos de que 'clientes' no sea undefined o null antes de intentar filtrarlo
  const clientesFiltrados = clientes?.filter(c => 
    c.name.toLowerCase().includes(clienteBuscado.toLowerCase())
  ) || [];

  return (
    <div className="p-3 card mt-2 table-responsive">
      {/* Sección de búsqueda de cliente */}
      <div className="mb-3">
        <label className="form-label">Buscar cliente:</label>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Escribí el nombre del cliente..."
          value={clienteBuscado}
          onChange={(e) => setClienteBuscado(e.target.value)}
        />
        <select
          className="form-select"
          value={cliente?.id || ""}
          onChange={(e) => {
            const clienteSeleccionado = clientes.find(c => c.id === parseInt(e.target.value));
            setClienteSeleccionado(clienteSeleccionado);
          }}
        >
          <option value="">Seleccioná un cliente</option>
          {clientesFiltrados.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.name}
            </option>
          ))}
        </select>
        {cliente && (
          <div className="mt-2">
            <strong>Cliente seleccionado:</strong> {cliente.name}
          </div>
        )}
      </div>

      {/* Título de productos seleccionados */}
      <h5>Productos seleccionados</h5>
      {productos.length === 0 ? (
        <p>No hay productos agregados</p>
      ) : (
        <table className="table table-bordered table-sm align-middle table-hover">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.nombre}</td>
                <td className="w-15 pb-0 pt-0 border">
                  <input 
                    type="number" 
                    className="form-control ps-2" 
                    min="1" 
                    step="0.5" 
                    value={producto.cantidad}
                    onChange={(e) => onActualizarCantidad(producto.id, parseFloat(e.target.value))}
                  />
                </td>
                <td>${producto.precio.toFixed(2)}</td>
                <td>${calcularSubtotal(producto).toFixed(2)}</td>
                <td className="py-0">
                  <button 
                    className="btn btn-danger btn-sm my-auto" 
                    onClick={() => onEliminarProducto(producto.id)}>
                    x
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VentaForm;
