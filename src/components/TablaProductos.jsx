import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProducts, deleteProduct } from "../services/requests/products";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import Swal from "sweetalert2";
import { formatNumber } from "../services/utils/format.js";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";

const VentaTable = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina] = useState(12);

  const fetchProductos = async () => {
    try {
      const data = await getAllProducts();
      const filtrados = data.filter((c) => c.name && c.name.trim() !== "");
      setProductos(filtrados);
      setPaginaActual(1);
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

  // Filtrado dinámico
  const productosFiltrados = productos.filter((producto) =>
    producto.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Cálculos para la paginación
  const indiceUltimoItem = paginaActual * itemsPorPagina;
  const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
  const itemsActuales = productosFiltrados.slice(
    indicePrimerItem,
    indiceUltimoItem
  );
  const totalPaginas = Math.ceil(productosFiltrados.length / itemsPorPagina);

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="">
      <div className="d-flex my-2 col-12 col-sm-6 col-md-5 col-lg-4 col-xl-3">
        <input
          type="text"
          className="form-control border border-2 ps-3"
          placeholder="🔍 Buscar producto por nombre..."
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPaginaActual(1);
          }}
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
        {itemsActuales.length > 0 ? (
          itemsActuales.map((producto) => (
            <div
              key={producto.id}
              className="col-6 col-sm-4 col-md-4 col-lg-3 col-xl-2 col-xxl-2 mb-3 px-1 d-flex"
            >
              <div
                className="card bg-gray w-100 d-flex flex-column"
                style={{ height: "100%" }}
              >
                <span
                  className="bg-success opacity-9 pb-1 col-sm-3 text-white text-center position-absolute"
                  style={{ zIndex: 3, borderRadius: "10px 0px 20px" }}
                >
                  {producto.profit_percentage}%
                </span>
                <div
                  className="card-header p-0 position-relative z-index-2 flex-grow-0"
                  style={{ borderRadius: "0.75rem 0.75rem 0px 0px" }}
                >
                  <div className="d-block blur-shadow-image">
                    <div
                      className="img-container"
                      style={{
                        height: "170px",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={producto.image_url || "/placeholder-product.png"}
                        alt="producto"
                        className="img-fluid w-100 h-100 object-fit-cover"
                        style={{
                          borderRadius: "0.75rem 0.75rem 0px 0px",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.src = "/placeholder-product.png";
                        }}
                      />
                    </div>
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
                </div>
                <div className="card-body p-2 d-flex flex-column flex-grow-1">
                  <h6
                    className="text-dark text-center nombre mb-1"
                    style={{
                      minHeight: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {producto.name}
                  </h6>
                  <div className="text-dark text-center border-bottom pb-1 border-gray mb-2">
                    $ {formatNumber(producto.sale_price)} / {producto.unit}
                  </div>

                  <div className="mt-auto text-center">
                    <Link
                      to={`/productos/editar/${producto.id}`}
                      className="btn mb-0 bg-info text-sm text-white btn-sm"
                    >
                      <BsPencilSquare />
                    </Link>

                    <button
                      onClick={() => handleDelete(producto.id)}
                      className="btn mb-0 btn-dark text-sm btn-sm ms-2"
                    >
                      <BsTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <h5>No hay productos encontrados</h5>
          </div>
        )}
      </div>

      {/* Paginación */}
      {productosFiltrados.length > itemsPorPagina && (
        <div className="col-12 d-flex justify-content-center mt-3">
          <div className="table-responsive">
            <div className="pagination py-1">
              <li
                className={`page-item bg-white ${
                  paginaActual === 1 ? "disabled" : ""
                }`}
              >
                <button
                  className={`page-link ${
                    paginaActual === 1 ? "disabled" : "text-info border-info"
                  }`}
                  onClick={() => cambiarPagina(paginaActual - 1)}
                  disabled={paginaActual === 1}
                >
                  <AiFillCaretLeft />
                </button>
              </li>

              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                (numero) => (
                  <div key={numero}>
                    <button
                      className={`page-link ${
                        paginaActual === numero
                          ? "bg-info text-white"
                          : "text-dark"
                      }`}
                      onClick={() => cambiarPagina(numero)}
                      style={{
                        cursor: "pointer",
                        borderRadius: "50%",
                        minWidth: "40px",
                        height: "40px",
                      }}
                    >
                      {numero}
                    </button>
                  </div>
                )
              )}

              <li
                className={`page-item ms-1 ${
                  paginaActual === totalPaginas ? "disabled" : ""
                }`}
              >
                <button
                  className={`page-link ${
                    paginaActual === totalPaginas
                      ? "disabled"
                      : "text-info border-info"
                  }`}
                  onClick={() => cambiarPagina(paginaActual + 1)}
                  disabled={paginaActual === totalPaginas}
                >
                  <AiFillCaretRight />
                </button>
              </li>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VentaTable;
