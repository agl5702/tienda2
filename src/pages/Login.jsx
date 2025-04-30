import { useState } from "react";
import Sidebar from "../components/Sidebar";
import logo from "../assets/logo3.png";
import { loginUser } from "@/services/auth/login";

export default function Login() {
  const [formData, setFormData] = useState({ full_name: "", password: "" });
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
      const response = await loginUser(formData);
      console.log("Login exitoso:", response);

      // Guardar token en localStorage o donde prefieras
      localStorage.setItem("token", response.access_token);

      // Redirigir o hacer algo más
      window.location.href = "/"; // ajustá la ruta a tu necesidad
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Usuario o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      {/* Sidebar oculto */}
      <div className="d-none">
        <Sidebar />
      </div>

      {/* Card de login */}
      <div
        className="card shadow-lg p-4 border-0"
        style={{
          maxWidth: "400px",
          width: "100%",
          borderRadius: "15px",
          background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
        }}
      >
        <div className="text-center mb-4">
          <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
            <img src={logo} alt="ocloud" style={{ width: "40px" }} />
            <h4 className="mb-0">Iniciar Sesión</h4>
          </div>
          <p className="text-muted">Ingresa tus credenciales para acceder</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label
              htmlFor="full_name"
              className="form-label fw-semibold"
              style={{ color: "#495057" }}
            >
              Usuario
            </label>
            <input
              type="text"
              className="form-control py-2 px-2"
              id="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Ingresa tu usuario"
              required
              style={{ borderRadius: "8px", border: "1px solid #ced4da" }}
            />
          </div>

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
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </button>

          <div className="text-center mt-3">
            <a
              href="/password-recovery"
              className="text-decoration-none mx-2"
              style={{ color: "#6c757d", fontSize: "0.9rem" }}
            >
              ¿Olvidaste tu contraseña?
            </a>
            <a
              href="/registro"
              className="text-decoration-none mx-2"
              style={{ color: "#6c757d", fontSize: "0.9rem" }}
            >
              Registrarme
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
