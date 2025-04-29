import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProducts, deleteProduct } from "../services/requests/products";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import Swal from "sweetalert2";
import { formatNumber } from "../services/utils/format.js";

const VentaTable = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const fetchProductos = async () => {
    try {
      const data = await getAllProducts();
      const filtrados = data.filter((c) => c.name && c.name.trim() !== "");
      setProductos(filtrados);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar este producto?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteProduct(id);
        fetchProductos();
        Swal.fire(
          "Eliminado",
          "El producto fue eliminado correctamente",
          "success"
        );
      } catch (error) {
        console.error("Error al eliminar producto:", error);
        Swal.fire("Error", "Hubo un problema al eliminar el producto", "error");
      }
    }
  };

  const limpiarInput = () => {
    setBusqueda("");
  };

  const calcularPrecioVenta = (producto) => {
    if (producto.purchase_price && producto.profit_percentage !== undefined) {
      return (
        producto.purchase_price *
        (1 + producto.profit_percentage / 100)
      ).toFixed(2);
    }
    return "0.00";
  };

  // Filtrado dinámico por nombre (puedes ampliar a categoría si quieres)
  const productosFiltrados = productos.filter((producto) =>
    producto.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="">
      <div className="d-flex my-2 col-12 col-sm-6 col-md-5 col-lg-4 col-xl-3">
        <input
          type="text"
          className="form-control border border-2 ps-3"
          placeholder="🔍 Buscar producto por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        {busqueda && (
          <button
            onClick={limpiarInput}
            className="bg-danger btn btn-sm text-white ms-1"
          >
            X
          </button>
        )}
      </div>

      <div className="row m-0 mt-4 p-0">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((producto) => (
            <div className="col-6 col-sm-4 col-md-4 col-lg-3 col-xl-2 col-xxl-2 mb-2 px-1">
              <div className="card bg-gray position-relative">
                <span
                  className="bg-success opacity-9 pb-1 col-sm-3 text-white text-center position-absolute"
                  style={{ zIndex: 3, borderRadius: "10px 0px 20px" }}
                >
                  {" "}
                  {producto.profit_percentage}%
                </span>
                <div
                  className="card-header p-0 position-relative z-index-2"
                  style={{ borderRadius: "0.75rem 0.75rem 0px 0px" }}
                >
                  <div className="d-block blur-shadow-image img-marco ">
                    <img
                      src={producto.image_url}
                      width="100%"
                      height="170vh"
                      alt="producto"
                      className="border-bottom img-size img-oferta "
                      style={{ borderRadius: "0.75rem 0.75rem 0px 0px" }}
                    />
                  </div>
                  <div
                    className="blur opacity-9 col-8 col-sm-6 text-dark text-center position-absolute"
                    style={{
                      zIndex: 3,
                      borderRadius: "7px 0px 0px",
                      bottom: "1px",
                      right: "1px",
                      height: "20px",
                      fontSize: "15px",
                    }}
                  >
                    {producto.category?.name || "Sin categoría"}
                  </div>
                  <div
                    className="colored-shadow"
                    style={{ backgroundImage: `url('${producto.image_url}')` }}
                  ></div>
                </div>
                <div className="px-2 py-0">
                  <p className="text-dark text-center nombre mt-1 mb-0">
                    {producto.name}
                  </p>
                  <div className="row justify-space-between text-center"></div>
                  <div className="text-dark text-center border-bottom pb-1 border-gray mb-2">
                    $ {formatNumber(producto.sale_price)} / {producto.unit}
                  </div>

                  <div className="col m-0 mb-2 text-center">
                    <Link
                      to={`/productos/editar/${producto.id}`}
                      className="btn mb-0 bg-info text-sm text-white btn-sm"
                    >
                      <BsPencilSquare />{" "}
                
                    </Link>

                    <button
                      onClick={() => handleDelete(producto.id)}
                      className="btn mb-0 btn-dark text-sm btn-sm ms-2"
                    >
                      <BsTrash />{" "}
                   
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>
            <div className="col text-center">No hay productos.</div>
          </div>
        )}
      </div>

      {/* <div className="table-responsive">
        <table className="table table-bordered table-striped  align-items-center ">
          <thead className="table bg-gradient-dark text-white">
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Unidad</th>
              <th>Compra</th>
              <th>% Ganancia</th>
              <th>Venta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.length > 0 ? (
              productosFiltrados.map((producto) => (
                <tr key={producto.id}>
                  <td>
                    <div className="row m-0">
                      <div className="col-auto">
                        <img
                          src={producto.image_url || 'https://i.postimg.cc/pdtpX3ZN/Captura-de-pantalla-2024-09-13-010502.png'}
                          className="img-fluid rounded-circle"
                          style={{ width: '30px', height: '30px' }}
                        />
                      </div>
                      <div className="col-auto">
                        {producto.name}
                      </div>
                    </div>
                  </td>
                  <td>{producto.category?.name || 'Sin categoría'}</td>
                  <td>{producto.unit || '---'}</td>
                  <td>${producto.purchase_price?.toFixed(2)}</td>
                  <td>{producto.profit_percentage}%</td>
                  <td>${calcularPrecioVenta(producto)}</td>
                  <td>
                    <Link to={`/productos/editar/${producto.id}`} className="btn mb-0 bg-info text-sm text-white btn-sm">
                    <BsPencilSquare/> Editar
                    </Link>
                    <button onClick={() => handleDelete(producto.id)} className="btn mb-0 btn-dark text-sm btn-sm ms-2">
                    <BsTrash /> Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No hay productos.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div> */}
    </div>
  );
};

export default VentaTable;
