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
    image_url: "", // Imagen ahora es opcional
    category_id: "",
    unit: "und",
    purchase_price: 0,
    profit_percentage: 0,
    sale_price: 0,
  });

  const [categorias, setCategorias] = useState([]);
  const unidades = ["und", "g", "kg", "ml", "l"]; // Corregido "kl" a "kg"

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar categorías
        const categoriasData = await getAllCategories();
        const filtradas = categoriasData.filter(
          (cat) => typeof cat.name === "string" && cat.name.trim() !== ""
        );
        setCategorias(filtradas);

        // Si es edición, cargar producto
        if (esEdicion) {
          setLoading(true);
          const productoData = await getProductById(id);
          setProducto({
            name: productoData.name,
            state: productoData.state,
            category_id: productoData.category_id || productoData.category?.id,
            unit: productoData.unit,
            image_url: productoData.image_url || "", // Imagen opcional
            purchase_price: parseFloat(productoData.purchase_price) || 0,
            profit_percentage: parseFloat(productoData.profit_percentage) || 0,
            sale_price: parseFloat(productoData.sale_price) || 0,
          });
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

  const handleChange = (e) => {
    const { name, value } = e.target;

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
        newState.profit_percentage =
          purchase_price > 0
            ? ((sale_price - purchase_price) / purchase_price) * 100
            : 0;
      } else if (name === "profit_percentage") {
        const profit_percentage = parseFloat(value);
        const purchase_price = parseFloat(prev.purchase_price);
        newState.profit_percentage = profit_percentage;
        newState.sale_price = purchase_price * (1 + profit_percentage / 100);
      } else {
        newState[name] = name === "state" ? !prev.state : value;
      }

      return newState;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
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
      // Preparar datos para enviar (image_url es opcional)
      const productoParaEnviar = {
        name: producto.name,
        state: producto.state,
        category_id: parseInt(producto.category_id),
        unit: producto.unit,
        purchase_price: parseFloat(producto.purchase_price),
        profit_percentage: parseFloat(producto.profit_percentage),
        sale_price: parseFloat(producto.sale_price),
        image_url: producto.image_url || null, // Envía null si está vacío
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

  const abrirAlerta = () => {
    Swal.fire({
      title: "Indicaciones!",
      html: `
        <p>Dirigete a la pagina y selecciona la imagen a subir:</p>
        <img className="w-50" src="/img/guia1.png" alt="guia1">
        <p>Espera que cargue la imagen y copia la URL que dice "Enlace directo"</p>
        <img className="w-80" src="/img/guia3.png" alt="guia1">
        <p>luego vuelve y pega la URL copiada</p>
        <a className="btn bg-info text-white" href="https://postimages.org/" target="_blank">ir a la pagina</a>
      `,
      showConfirmButton: true,
    });
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
                <div className="col-auto border border-radius-2xl mb-3 p-2">
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
                </div>
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
                      <option key={i} value={u}>
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
                  min="0"
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
                  step="0.1"
                  min="0"
                  name="profit_percentage"
                  value={producto.profit_percentage}
                  onChange={handleChange}
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
                    <button
                      type="button"
                      onClick={abrirAlerta}
                      className="btn btn-sm btn-outline-success"
                      disabled={loading}
                    >
                      subir nueva
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
        </div>
      </div>
    </div>
  );
};

export default FormProducto;
