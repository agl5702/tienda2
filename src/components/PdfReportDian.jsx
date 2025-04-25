// src/components/TablaConPDF.jsx
import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const TablaConPDF = () => {
  // Obtener la fecha actual y formatearla
  const hoy = new Date();
  const fechaFormateada = hoy.toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  // Generar el PDF

  const generarPDF = async () => {
    const elemento = document.getElementById('tabla-pdf');

    if (!elemento) return;

    const canvas = await html2canvas(elemento, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('mi-tabla.pdf');
  };

  return (
    <div className="p-4">
      {/* Tabla que se exportará a PDF */}
      <div id="tabla-pdf" className="border p-4 bg-white">
        Reporte de Ventas para declaración del {fechaFormateada}

        <table className="w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Producto</th>
              <th className="border p-2">Cantidad</th>
              <th className="border p-2">Precio</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">Nepe 3cm</td>
              <td className="border p-2">2</td>
              <td className="border p-2">$10</td>
            </tr>
            <tr>
              <td className="border p-2">hueco de 0.5 de diametro para meter riata</td>
              <td className="border p-2">3</td>
              <td className="border p-2">$5</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Botón para generar PDF */}
      <button
        onClick={generarPDF}
        className="mt-4 px-4 py-2 bg-info text-white rounded hover:bg-blue-600"
      >
        Descargar Reporte para DIAN
      </button>
    </div>
  );
};

export default TablaConPDF;
