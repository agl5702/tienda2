import { useState } from "react";
import Sidebar from "../components/Sidebar";
import logo from "../assets/logo3.png";
import { passwordRecovery } from "@/services/auth/password_recovery";

export default function PasswordRecovery() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await passwordRecovery({ email });

      if (response.status === 202) {
        setMessage(
          "📬 Se ha enviado un correo con instrucciones para restablecer tu contraseña. ¡Revisa tu bandeja de entrada!"
        );
      } else {
        throw new Error("Algo salió mal");
      }
    } catch (err) {
      console.error("Error en recuperación:", err);
      setError(
        "No pudimos enviar el correo. Verifica que el email sea correcto o inténtalo más tarde."
      );
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

      {/* Card de recuperación */}
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
            <h4 className="mb-0">Recuperar Contraseña</h4>
          </div>
          <p className="text-muted">
            Ingresa tu correo electrónico para recibir instrucciones
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label
              htmlFor="email"
              className="form-label fw-semibold"
              style={{ color: "#495057" }}
            >
              Correo electrónico
            </label>
            <input
              type="email"
              className="form-control py-2 px-2"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              required
              style={{ borderRadius: "8px", border: "1px solid #ced4da" }}
            />
          </div>

          {message && <div className="alert alert-success py-2">{message}</div>}
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
            {loading ? "Enviando..." : "Recuperar Contraseña"}
          </button>

          <div className="text-center mt-3">
            <a
              href="/login"
              className="text-decoration-none"
              style={{ color: "#6c757d", fontSize: "0.9rem" }}
            >
              Volver al inicio de sesión
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
