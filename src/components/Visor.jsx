import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importa los íconos de ojo

function DebugButton() {
  // Estado para controlar si las líneas de depuración están activadas
  const [debug, setDebug] = useState(false);

  // Función para alternar el estado de las líneas de depuración
  const toggleDebug = () => {
    setDebug((prevDebug) => !prevDebug); // Alternar entre true y false
  };

  // Efecto para detectar la tecla "Q"
  useEffect(() => {
    // Función para manejar la presión de teclas
    const handleKeyPress = (event) => {
      if (event.key === "Q" || event.key === "q") {
        toggleDebug(); // Alternar el estado de depuración
      }
    };

    // Añadir el event listener cuando el componente se monta
    window.addEventListener("keydown", handleKeyPress);

    // Limpiar el event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []); // Este efecto solo se ejecuta una vez al montar el componente

  // Efecto para agregar o quitar la clase "debug" al body
  useEffect(() => {
    if (debug) {
      document.body.classList.add("debug");
    } else {
      document.body.classList.remove("debug");
    }

    // Limpiar cuando el componente se desmonte
    return () => {
      document.body.classList.remove("debug");
    };
  }, [debug]);

  return (
    <div>
     <button onClick={toggleDebug} className={`btn btn-sm text-white mb-0 ${debug ? "bg-success" : "bg-info"}`}>
        {debug ? <FaEyeSlash /> : <FaEye />}
     </button>
    </div>
  );
}

export default DebugButton;
