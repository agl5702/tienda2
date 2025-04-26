import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFTable from './PDFTable';

const DownloadButton = ({ productos }) => (
  <PDFDownloadLink
    document={<PDFTable productos={productos} />}
    fileName="productos.pdf"
    style={{
      backgroundColor: '#007bff',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '5px',
      textDecoration: 'none',
    }}
  >
    {({ loading }) => loading ? 'Generando PDF...' : 'Descargar PDF - react-pdf'}
  </PDFDownloadLink>
);

export default DownloadButton;
