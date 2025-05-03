import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAllProducts,
  deleteProduct,
  addStockProductById,
  removeStockProductById,
} from "../services/requests/products";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import Swal from "sweetalert2";
import { formatNumber } from "../services/utils/format.js";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import Modal from "./Modal.jsx";
import { HiClipboardDocumentList } from "react-icons/hi2";

const VentaTable = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina] = useState(12);

  // Modales para gestión de stock
  const [showStockOptionsModal, setShowStockOptionsModal] = useState(false);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [stockQuantity, setStockQuantity] = useState("");
  const [currentOperation, setCurrentOperation] = useState(null); // 'add' o 'remove'
  const [isProcessing, setIsProcessing] = useState(false);

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

  const abrirModalOpcionesStock = (producto) => {
    setProductoSeleccionado(producto);
    setShowStockOptionsModal(true);
  };

  const abrirModalCantidad = (operation) => {
    setCurrentOperation(operation);
    setStockQuantity("");
    setShowStockOptionsModal(false);
    setShowQuantityModal(true);
  };

  const handleStockOperation = async () => {
    setIsProcessing(true);
    try {
      const productId = productoSeleccionado?.id;
      const quantityValue = parseFloat(stockQuantity);

      if (!productId) {
        throw new Error("No se ha seleccionado un producto válido");
      }

      if (isNaN(quantityValue)) {
        throw new Error("La cantidad debe ser un número válido");
      }

      if (quantityValue <= 0) {
        throw new Error("La cantidad debe ser mayor que cero");
      }

      let result;
      if (currentOperation === "add") {
        result = await addStockProductById(productId, quantityValue);
      } else {
        if (
          productoSeleccionado.stock !== null &&
          productoSeleccionado.stock !== undefined &&
          quantityValue > productoSeleccionado.stock
        ) {
          throw new Error(
            `No puedes restar más stock (${quantityValue}) del disponible (${productoSeleccionado.stock})`
          );
        }
        result = await removeStockProductById(productId, quantityValue);
      }

      if (!result || result.error) {
        throw new Error(
          result?.error ||
            `No se pudo ${
              currentOperation === "add" ? "añadir" : "restar"
            } el stock correctamente`
        );
      }

      Swal.fire({
        icon: "success",
        title: "Operación exitosa",
        html: `<div>
                <p>Stock actualizado correctamente</p>
                <p><strong>Producto:</strong> ${productoSeleccionado.name}</p>
                <p><strong>Operación:</strong> ${
                  currentOperation === "add" ? "Añadido" : "Restado"
                } ${quantityValue} ${productoSeleccionado.unit}</p>
              </div>`,
        showConfirmButton: true,
        timer: 3000,
      });

      // Actualizar la lista de productos
      fetchProductos();
      setShowQuantityModal(false);
    } catch (error) {
      console.error("Error en la operación de stock:", error);
      Swal.fire({
        icon: "error",
        title: "Error en la operación",
        html: `<div>
                <p>${
                  error.message || "Ocurrió un error al procesar la operación"
                }</p>
                <small>Por favor verifique los datos e intente nuevamente</small>
              </div>`,
        showConfirmButton: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

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
          className="form-control border border-2 ps-3 bg-white"
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
              className="col-6 col-sm-4 col-md-4 col-lg-3 col-xl-2 col-xxl-2 mb-2 px-1 d-flex"
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

                {/* Botón para gestionar stock */}
                <button
                  className="bg-info border-white border border-2 cursor-pointer text-white text-center position-absolute end-2 top-2"
                  style={{
                    zIndex: 3,
                    borderRadius: "20px",
                    width: "35px",
                    height: "35px",
                  }}
                  onClick={() => abrirModalOpcionesStock(producto)}
                >
                  <HiClipboardDocumentList/>
                </button>

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
                    className="blur col-8 col-sm-6 text-dark text-center position-absolute"
                    style={{
                      zIndex: 3,
                      borderRadius: "7px 0px 0px",
                      bottom: "1px",
                      right: "1px",
                      height: "20px",
                      fontSize: "15px",
                    }}
                  >
                    Stock: {producto.stock || 0}
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
                className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}
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

      {/* Modal de opciones de stock */}
      <Modal
        isOpen={showStockOptionsModal}
        onClose={() => setShowStockOptionsModal(false)}
        title={`Gestión de stock de ${productoSeleccionado?.name}`}
        footer={"d-none"}
      >
        <div className="text-center mb-3">
          <p>Seleccione la operación que desea realizar:</p>
        </div>

        <div className="d-flex justify-content-center gap-3">
          <button
            className="btn btn-success text-white"
            onClick={() => abrirModalCantidad("add")}
          >
            Sumar a stock
          </button>
          <button
            className="btn btn-danger"
            onClick={() => abrirModalCantidad("remove")}
          >
            Restar a stock
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setShowStockOptionsModal(false)}
          >
            Cancelar
          </button>
        </div>
      </Modal>

      {/* Modal para ingresar cantidad */}
      <Modal
        isOpen={showQuantityModal}
        onClose={() => !isProcessing && setShowQuantityModal(false)}
        title={`${currentOperation === "add" ? "Sumar" : "Restar"} stock - ${
          productoSeleccionado?.name
        }`}
        footer={"d-none"}
      >
        <div className="mb-2">
          <div className="d-flex">
            <label className="form-label fw-bold text-dark ">
              Cantidad a {currentOperation === "add" ? "sumar" : "restar"}
            </label>
            <div className="col text-end">
              {productoSeleccionado?.stock !== null &&
                productoSeleccionado?.stock !== undefined && (
                  <small className="text-dark border border-dark py-1 px-3 border-radius-2xl">
                    Stock actual: {productoSeleccionado.stock} /{productoSeleccionado.unit}
                  </small>
              )}
            </div>
          </div>
          
          <input
            type="number"
            className="form-control border-primary px-2 border border-dark"
            value={stockQuantity}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
                setStockQuantity(value);
              }
            }}
            placeholder={`Ingrese la cantidad a ${
              currentOperation === "add" ? "sumar" : "restar"
            }`}
            min="0.01"
            step="0.01"
            disabled={isProcessing}
          />
          
        </div>

        {stockQuantity > 0 && (
          <div className="col text-center mb-3 mt-3">
            {productoSeleccionado?.stock !== null &&
              productoSeleccionado?.stock !== undefined && (
                <small className="text-dark border border-dark py-1 px-3 rounded-pill">
                  El Nuevo Stock Será: {Math.max(
                    0,
                    currentOperation === "add"
                      ? Number(productoSeleccionado.stock) + Number(stockQuantity)
                      : Number(productoSeleccionado.stock) - Number(stockQuantity)
                  )} /{productoSeleccionado.unit}
                </small>
              )}
          </div>
        )}
        
        
        <div className="text-center">
          <button
            className="btn btn-secondary"
            onClick={() => setShowQuantityModal(false)}
            disabled={isProcessing}
          >
            Cancelar
          </button>
          <button
            className="btn ms-2 bg-info text-white"
            onClick={handleStockOperation}
            disabled={
              !stockQuantity || parseFloat(stockQuantity) <= 0 || isProcessing
            }
          >
            {isProcessing ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              `Confirmar ${currentOperation === "add" ? "suma" : "resta"}`
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default VentaTable;
