import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
});

const PDFTable = ({ productos }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={{ marginBottom: 10 }}>
        Productos - {new Date().toLocaleDateString('es-ES')}
      </Text>

      <View style={styles.table}>
        <View style={[styles.row, styles.header]}>
          <Text style={styles.cell}>Producto</Text>
          <Text style={styles.cell}>Cantidad</Text>
          <Text style={styles.cell}>Precio</Text>
        </View>

        {productos.map((item, index) => (
          <View style={styles.row} key={index}>
            <Text style={styles.cell}>{item.nombre}</Text>
            <Text style={styles.cell}>{item.cantidad}</Text>
            <Text style={styles.cell}>${item.precio}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default PDFTable;
