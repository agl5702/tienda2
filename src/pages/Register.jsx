import { useState } from "react";
import Sidebar from "../components/Sidebar";
import logo from "../assets/logo3.png";
import { registerUser } from "@/services/auth/register";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
    direction: "",
    image: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await registerUser(formData);
      console.log("Registro exitoso:", response);
      window.location.href = "/login";
    } catch (err) {
      console.error("Error al registrarse:", err);
      setError("Ocurrió un error al registrarse. Verifica los datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="d-none">
        <Sidebar />
      </div>

      <div
        className="card shadow-lg p-4 border-0"
        style={{
          maxWidth: "500px",
          width: "100%",
          borderRadius: "15px",
          background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
        }}
      >
        <div className="text-center mb-4">
          <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
            <img src={logo} alt="ocloud" style={{ width: "40px" }} />
            <h4 className="mb-0">Registrarse</h4>
          </div>
          <p className="text-muted">Crea tu cuenta para continuar</p>
        </div>

        <form onSubmit={handleSubmit}>
          {[
            {
              id: "full_name",
              label: "Nombre completo",
              placeholder: "Ingresa tu nombre completo",
              required: true,
            },
            {
              id: "email",
              label: "Correo electrónico",
              placeholder: "ejemplo@correo.com",
              required: true,
            },
            {
              id: "phone",
              label: "Teléfono",
              placeholder: "Número de contacto",
              required: true,
            },
            {
              id: "direction",
              label: "Dirección",
              placeholder: "Dirección (opcional)",
              required: false,
            },
            {
              id: "image",
              label: "Imagen (URL)",
              placeholder: "https://tuimagen.com/ejemplo.jpg",
              required: false,
            },
          ].map(({ id, label, placeholder, required }) => (
            <div className="mb-3" key={id}>
              <label
                htmlFor={id}
                className="form-label fw-semibold"
                style={{ color: "#495057" }}
              >
                {label}
              </label>
              <input
                type="text"
                className="form-control py-2 px-2"
                id={id}
                value={formData[id]}
                onChange={handleChange}
                placeholder={placeholder}
                required={required}
                style={{ borderRadius: "8px", border: "1px solid #ced4da" }}
              />
            </div>
          ))}

          <div className="mb-3">
            <label
              htmlFor="password"
              className="form-label fw-semibold"
              style={{ color: "#495057" }}
            >
              Contraseña
            </label>
            <input
              type="password"
              className="form-control py-2 px-2"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
              required
              style={{ borderRadius: "8px", border: "1px solid #ced4da" }}
            />
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="btn w-100 py-2 text-white fw-bold border-0"
            style={{
              borderRadius: "8px",
              background: "linear-gradient(45deg, #3498db, #2c3e50)",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>

          <div className="text-center mt-3">
            <a
              href="/login"
              className="text-decoration-none"
              style={{ color: "#6c757d", fontSize: "0.9rem" }}
            >
              ¿Ya tienes una cuenta? Inicia sesión
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
