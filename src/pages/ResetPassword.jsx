import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "@/services/auth/reset_password";
import Sidebar from "../components/Sidebar";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate(); // 👈 Redirección
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Token inválido o faltante.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await resetPassword({
        token,
        new_password: newPassword,
      });

      setMessage("✅ Contraseña actualizada correctamente. Redirigiendo...");
      setTimeout(() => {
        navigate("/login"); // 👈 Redirige después de 2 segundos
      }, 2000);
    } catch (err) {
      console.error("Error:", err);
      setError(err?.message || "Hubo un problema al actualizar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="d-none">
        <Sidebar />
      </div>
      <div
        className="card p-4 shadow-lg border-0"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h4 className="mb-3 text-center">Restablecer Contraseña</h4>

        {error && <div className="alert alert-danger py-2">{error}</div>}
        {message && <div className="alert alert-success py-2">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label fw-semibold">
              Nueva contraseña
            </label>
            <input
              type="password"
              className="form-control"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn w-100 text-white fw-bold"
            style={{
              background: "linear-gradient(45deg, #3498db, #2c3e50)",
              border: "none",
              borderRadius: "8px",
              opacity: loading ? 0.7 : 1,
            }}
            disabled={loading}
          >
            {loading ? "Actualizando..." : "Actualizar contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}
