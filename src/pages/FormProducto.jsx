import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar.jsx";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../services/requests/products.js";
import { getAllCategories } from "../services/requests/categories.js";

export default function FormProducto() {
  const [name, setName] = useState("");
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0); // Puede ser 0 si no se proporciona
  const [profitPercentage, setProfitPercentage] = useState(0); // Puede ser 0 si no se proporciona
  const [unit, setUnit] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState(""); // ID de categoría seleccionada
  const [categories, setCategories] = useState([]); // Almacenamos las categorías aquí

  const history = useNavigate(); // Cambié useHistory por useNavigate

  // Obtener categorías al cargar el componente
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories(); // Función para obtener todas las categorías
        setCategories(data); // Establecer las categorías en el estado
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que los campos requeridos estén completos
    if (!name || !purchasePrice || !unit || !categoryId) {
      alert("Los campos Nombre, Precio de Compra, Unidad y Categoría son requeridos.");
      return;
    }

    // Crear el objeto del producto conforme a la estructura de la API
    const productData = {
      name: name,
      state: true, // Siempre se asume como true en este caso
      purchase_price: parseFloat(purchasePrice),
      sale_price: salePrice ? parseFloat(salePrice) : 0, // Si no hay precio de venta, enviar 0
      profit_percentage: parseFloat(profitPercentage) || 0, // Asegura que se envíe como flotante
      image_url: imageUrl,
      category_id: parseInt(categoryId), // Usamos el ID de la categoría seleccionada
      unit: unit,
    };

    try {
      // Llamar a la función createProduct para enviar los datos a la API
      await createProduct(productData);
      history("/productos"); // Redirige a la página de productos después de agregarlo
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  return (
    <div className="m-0" style={{ paddingLeft: "4.5rem" }}>
      <Sidebar />
      <div className="col" style={{ minHeight: "100vh" }}>
        <div className="card p-2">
          <div className="my-4">
            <div className="card-header pb-0">
              <h6>Agregar Producto</h6>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Nombre del Producto</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ej: Leche Entera"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="col-md-3 mb-3">
                    <label className="form-label">Precio de Compra</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      placeholder="Ej: 2.99"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(e.target.value)}
                    />
                  </div>

                  <div className="col-md-3 mb-3">
                    <label className="form-label">Precio de Venta (Opcional)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      placeholder="Ej: 3.99"
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Porcentaje de Ganancia (Opcional)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Ej: 20"
                      value={profitPercentage}
                      onChange={(e) => setProfitPercentage(e.target.value)}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Unidad de Medida</label>
                    <select
                      className="form-select"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                    >
                      <option value="">Seleccionar</option>
                      <option value="UNIDAD">Unidad</option>
                      <option value="GRAMOS">Gramos</option>
                      <option value="KILOGRAMOS">Kilogramos</option>
                      <option value="MILILITROS">Mililitros</option>
                      <option value="LITROS">Litros</option>
                      <option value="METROS">Metros</option>
                    </select>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Categoría</label>
                    <select
                      className="form-select"
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                    >
                      <option value="">Seleccionar</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">URL de la Imagen</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ej: http://imagen.com"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                  </div>
                </div>

                <div className="text-end">
                  <button type="submit" className="btn btn-primary">
                    Guardar Producto
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
