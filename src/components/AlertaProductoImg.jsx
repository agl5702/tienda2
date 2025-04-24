import React from 'react';
import Swal from 'sweetalert2';

const AlertaBoton = () => {
  const abrirAlerta = () => {
    Swal.fire({
      title: '¡Alerta!',
      text: 'Esta es una alerta personalizada.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      html: `
        <strong>¡Esta es una alerta con HTML!</strong><br>
        <p>Puedes incluir contenido <a href="https://www.example.com" target="_blank">enlaces</a> y etiquetas HTML.</p>
      `, // Aquí usas HTML
    });
  };

  return (
    <div>
      <button onClick={abrirAlerta} className="btn btn-primary">
        Abrir Alerta
      </button>
    </div>
  );
};

export default AlertaBoton;
