import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  createProduct,
  getProductById,
  updateProduct,
} from "../services/requests/products";
import { getAllCategories } from "../services/requests/categories";
import Sidebar from "../components/Sidebar.jsx";
import MenuMovil from "../components/MenuMovil.jsx";
import Swal from "sweetalert2";

const FormProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const esEdicion = Boolean(id);
  const [loading, setLoading] = useState(false);

  const [producto, setProducto] = useState({
    name: "",
    state: false,
    image_url: "",
    category_id: "",
    unit: "und",
    purchase_price: "",
    profit_percentage: 0,
    sale_price: 0,
  });

  const [displayProfit, setDisplayProfit] = useState("0");
  const [categorias, setCategorias] = useState([]);
  const unidades = ["und", "g", "kg", "ml", "l"];

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const categoriasData = await getAllCategories();
        const filtradas = categoriasData.filter(
          (cat) => typeof cat.name === "string" && cat.name.trim() !== ""
        );
        setCategorias(filtradas);

        if (esEdicion) {
          setLoading(true);
          const productoData = await getProductById(id);
          const profit = parseFloat(productoData.profit_percentage || 0);
          setProducto({
            name: productoData.name,
            state: productoData.state,
            category_id: productoData.category_id || productoData.category?.id,
            unit: productoData.unit,
            image_url: productoData.image_url || "",
            purchase_price: parseFloat(productoData.purchase_price) || 0,
            profit_percentage: profit,
            sale_price: parseFloat(productoData.sale_price) || 0,
          });
          setDisplayProfit(
            profit % 1 === 0 ? profit.toString() : profit.toFixed(3)
          );
        }
      } catch (error) {
        console.error("Error al cargar datos", error);
        Swal.fire(
          "Error",
          "No se pudieron cargar los datos necesarios",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id, esEdicion]);

  const handleProfitChange = (e) => {
    const value = e.target.value;
    setDisplayProfit(value);

    if (value === "" || isNaN(parseFloat(value))) {
      setProducto((prev) => ({
        ...prev,
        profit_percentage: 0,
        sale_price: prev.purchase_price,
      }));
      return;
    }

    const profit = parseFloat(value);
    setProducto((prev) => ({
      ...prev,
      profit_percentage: profit,
      sale_price: prev.purchase_price * (1 + profit / 100),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "profit_percentage") {
      handleProfitChange(e);
      return;
    }

    setProducto((prev) => {
      const newState = { ...prev };

      if (name === "purchase_price") {
        const purchase_price = value === "" ? 0 : parseFloat(value);
        newState.purchase_price = purchase_price;
        newState.sale_price =
          purchase_price * (1 + prev.profit_percentage / 100);
      } else if (name === "sale_price") {
        const sale_price = parseFloat(value);
        const purchase_price = parseFloat(prev.purchase_price);
        newState.sale_price = sale_price;
        const profit =
          purchase_price > 0
            ? ((sale_price - purchase_price) / purchase_price) * 100
            : 0;
        newState.profit_percentage = profit;
        setDisplayProfit(
          profit % 1 === 0 ? profit.toString() : profit.toFixed(3)
        );
      } else {
        newState[name] = name === "state" ? !prev.state : value;
      }

      return newState;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!producto.name || !producto.category_id || !producto.unit) {
      Swal.fire(
        "Error",
        "Por favor complete todos los campos requeridos",
        "error"
      );
      return;
    }

    if (producto.purchase_price <= 0 || producto.sale_price <= 0) {
      Swal.fire("Error", "Los precios deben ser mayores a cero", "error");
      return;
    }

    try {
      const productoParaEnviar = {
        name: producto.name,
        state: producto.state,
        category_id: parseInt(producto.category_id),
        unit: producto.unit,
        purchase_price: parseFloat(producto.purchase_price),
        profit_percentage: parseFloat(producto.profit_percentage),
        sale_price: parseFloat(producto.sale_price),
        image_url: producto.image_url || null,
      };

      setLoading(true);

      if (esEdicion) {
        await updateProduct(id, productoParaEnviar);
        Swal.fire("Éxito", "Producto actualizado correctamente", "success");
      } else {
        await createProduct(productoParaEnviar);
        Swal.fire("Éxito", "Producto creado correctamente", "success");
      }

      navigate("/productos");
    } catch (error) {
      console.error("Error al guardar producto", error);
      Swal.fire("Error", "No se pudo guardar el producto", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading && esEdicion) {
    return (
      <div className="m-0 padding-menu">
        <Sidebar />
        <MenuMovil />
        <div
          className="col p-2 d-flex justify-content-center align-items-center"
          style={{ minHeight: "100vh" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="m-0 padding-menu">
      <Sidebar />
      <MenuMovil />
      <div className="col p-2" style={{ minHeight: "100vh" }}>
        <div className="card p-3">
          <h2>{esEdicion ? "Editar Producto" : "Nuevo Producto"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="row m-0">
              <div className="col-md-6 mb-3">
                <label>Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={producto.name}
                  onChange={handleChange}
                  className="form-control border ps-2"
                  required
                  disabled={loading}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Categoría</label>
                <select
                  name="category_id"
                  value={producto.category_id}
                  onChange={handleChange}
                  className="form-control border ps-2"
                  required
                  disabled={loading}
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 d-flex mb-3">
                {/* <div className="col-auto border border-radius-2xl mb-3 p-2">
                  <label className="form-label d-block">¿Declara IVA?</label>
                  <div className="form-check form-switch">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="stateSwitch"
                      checked={producto.state}
                      onChange={() =>
                        setProducto((prev) => ({ ...prev, state: !prev.state }))
                      }
                      disabled={loading}
                    />
                    <label
                      className="form-check-label ms-2"
                      htmlFor="stateSwitch"
                    >
                      {producto.state ? "Sí" : "No"}
                    </label>
                  </div>
                </div> */}
                <div className="col ps-2">
                  <label>Unidad</label>
                  <select
                    name="unit"
                    value={producto.unit}
                    onChange={handleChange}
                    className="form-control border ps-2"
                    required
                    disabled={loading}
                  >
                    {unidades.map((u, i) => (
                      <option key={`unit-${i}`} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <label>Precio de Compra</label>
                <input
                  type="number"
                  step="0.01"
                  min="100"
                  name="purchase_price"
                  value={producto.purchase_price}
                  onChange={handleChange}
                  className="form-control border ps-2"
                  required
                  disabled={loading}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>% Ganancia</label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  name="profit_percentage"
                  value={displayProfit}
                  onChange={handleProfitChange}
                  onBlur={() => {
                    if (displayProfit && !isNaN(parseFloat(displayProfit))) {
                      const num = parseFloat(displayProfit);
                      setDisplayProfit(
                        num % 1 === 0 ? num.toString() : num.toFixed(3)
                      );
                    }
                  }}
                  className="form-control border ps-2"
                  required
                  disabled={loading}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Precio de Venta</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="sale_price"
                  value={producto.sale_price}
                  onChange={handleChange}
                  className="form-control border ps-2"
                  required
                  disabled={loading}
                />
              </div>

              <div className="col-12 col-md-6 mx-auto mb-4">
                <label className="col-12">URL de Imagen (Opcional)</label>
                <div className="row">
                  <div className="col-9 my-auto">
                    <input
                      type="url"
                      className="form-control border ps-2"
                      value={producto.image_url}
                      onChange={handleChange}
                      name="image_url"
                      placeholder="Opcional - pegue URL de imagen"
                      disabled={loading}
                    />
                  </div>
                  <div className="col-3 my-auto">
                    {/* Botón para abrir el modal */}
                    <button type="button" className="btn btn-sm btn-outline-success" onClick={() => setIsOpen(true)}>
                      Subir nueva imagen
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center py-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/productos")}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn bg-info text-white ms-2"
                disabled={loading}
              >
                {loading ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : esEdicion ? (
                  "Actualizar"
                ) : (
                  "Crear"
                )}
              </button>
            </div>
          </form>

          {/* modal */}
          {isOpen && (
            <div
              className="modal modal-lg fade show d-block"
              tabIndex="-1"
              role="dialog"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
              onClick={() => setIsOpen(false)}
            >
              <div
                className="modal-dialog modal-dialog-centered"
                role="document"
                onClick={(e) => e.stopPropagation()} // Evitar que se cierre al hacer clic dentro
              >
                <div className="modal-content">
                  {/* Modal Header */}
                  <div className="modal-header">
                    <h5 className="modal-title">
                    Instrucciones para subir imágenes
                    </h5>
                    <button
                      type="button"
                      className="btn-close bg-danger"
                      onClick={() => setIsOpen(false)}
                      aria-label="Close"
                    ></button>
                  </div>

                  <div className="modal-body mx-auto text-center">
                    <p className="text-start">1. Dirígete a <a className="btn btn-sm btn-info" href="https://postimages.org/" target="_blank">postimages.org</a> y selecciona una imagen de tu dispositivo:</p>
                    <img 
                      src="/img/guia1.png" 
                      alt="Paso 1" 
                      className="guide-image"
                    />

                    <p className="text-start">2. Espera que cargue la imagen y Copia el <strong>Enlace directo</strong> después de cargar:</p>
                    <img 
                      src="/img/guia3.png" 
                      alt="Paso 2" 
                      className="guide-image"
                    />

                    <p className="text-start">3. Pega la URL en el campo de imagen.</p>
                  
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setIsOpen(false)}
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
     
        </div>
      </div>
    </div>
  );
};

export default FormProducto;
