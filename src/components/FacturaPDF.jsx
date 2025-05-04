import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { formatQuantity } from "../services/utils/formatQuantity";

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 20,
    paddingVertical: 30, // Añade margen superior e inferior
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    marginTop: -20,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 5,
  },
  businessInfo: {
    textAlign: "center",
    marginBottom: 4,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoColumn: {
    width: "48%",
  },
  infoLabel: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  infoText: {
    marginBottom: 5,
  },
  table: {
    width: "100%",
    marginTop: 0,
    marginBottom: 0,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
    paddingVertical: 5,
  },
  tableHeader: {
    backgroundColor: "#f2f2f2",
    fontWeight: "bold",
  },
  tableCol: {
    paddingHorizontal: 2,
  },
  colCant: {
    width: "15%",
  },
  colDesc: {
    width: "45%",
  },
  colVrU: {
    width: "20%",
    textAlign: "right",
  },
  colVrT: {
    width: "20%",
    textAlign: "right",
  },
  totals: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#000",
    paddingTop: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  totalLabel: {
    fontWeight: "bold",
  },
  totalValue: {
    fontWeight: "bold",
  },
  footer: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 9,
    color: "#666",
  },
  signature: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureLine: {
    width: "40%",
    borderTopWidth: 1,
    borderTopColor: "#000",
    textAlign: "center",
    paddingTop: 5,
  },
  pageFooter: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  footerLogo: {
    width: 25,
    height: 15,
    marginRight: 3,
  },
  footerText: {
    fontSize: 10,
    color: "#00bfff",
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 20,
    marginTop: -20,
    marginBottom: 25,
  },
  logo: {
    margin: 0,
    padding: 0,
    width: 70,
    height: 65,
  },
  debtNote: {
    marginTop: 0,
    fontSize: 8,
    color: "#000",
    textAlign: "right",
  },
});

const FacturaPDF = ({ order, currentBalance }) => {
  // Formatear números con separadores de miles
  const formatNumber = (num) => {
    return new Intl.NumberFormat("es-CO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num || 0);
  };

  // Calcular totales
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.quantity * item.price_unit,
    0
  );
  const total = subtotal;

  // Calcular el saldo total sumando todas las deudas
  // Usa directamente currentBalance
  const saldo = currentBalance;

  return (
    <Document>
      <Page size="A5" style={styles.page}>
        {/* Encabezado */}
        <View style={styles.logoContainer}>
          <Image src="/logo4.png" style={styles.logo} />
        </View>
        <View style={styles.header}>
          <Text style={styles.title}>JHS. Camino, Verdad y Vida</Text>
          <Text style={styles.subtitle}>Nit: 77159558-1</Text>
          <Text style={styles.businessInfo}>
            Perecederos #1 local 13 Mercabastos - valledupar
          </Text>
          <Text style={styles.businessInfo}>Whatsapp: 3005092939</Text>
          <Text style={styles.businessInfo}>jhscristoenmi@gmail.com</Text>
        </View>

        {/* Información de la factura */}
        <View style={styles.infoContainer}>
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>CLIENTE</Text>
            <Text style={styles.infoText}>
              {order.customer?.name || "Cliente ocasional"}
            </Text>
            <Text style={styles.infoLabel}>DOCUMENTO</Text>
            <Text style={styles.infoText}>
              {order.customer?.cc || "No especificado"}
            </Text>
            <Text style={styles.infoLabel}>TELÉFONO</Text>
            <Text style={styles.infoText}>
              {order.customer?.phone || "No especificado"}
            </Text>
            
          </View>
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>FECHA</Text>
            <Text style={styles.infoText}>
              {new Date(order.date).toLocaleString()}
            </Text>
            <Text style={styles.infoLabel}>VENTA No.</Text>
            <Text style={styles.infoText}>
              {order.id.toString().padStart(8, "0")}
            </Text>
            <Text style={styles.infoLabel}>DIRECCIÓN</Text>
            <Text style={styles.infoText}>
              {order.customer?.direction || "No especificado"}
            </Text>
          </View>
        </View>

        {/* Tabla de productos */}
        <View style={styles.table}>
          {/* Encabezado de la tabla */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={[styles.tableCol, styles.colCant]}>
              <Text>CANT.</Text>
            </View>
            <View style={[styles.tableCol, styles.colDesc]}>
              <Text>DESCRIPCIÓN</Text>
            </View>
            <View style={[styles.tableCol, styles.colVrU]}>
              <Text>VR/U</Text>
            </View>
            <View style={[styles.tableCol, styles.colVrT]}>
              <Text>VR/T</Text>
            </View>
          </View>

          {/* Productos */}
          {order.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={[styles.tableCol, styles.colCant]}>
                <Text>
                  {formatQuantity(item.quantity)} {item.product.unit}
                </Text>
              </View>
              <View style={[styles.tableCol, styles.colDesc]}>
                <Text>{item.product?.name || "Producto sin nombre"}</Text>
              </View>
              <View style={[styles.tableCol, styles.colVrU]}>
                <Text>${formatNumber(item.price_unit)}</Text>
              </View>
              <View style={[styles.tableCol, styles.colVrT]}>
                <Text>${formatNumber(item.quantity * item.price_unit)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Totales */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>No PRODUCTOS:</Text>
            <Text>{order.items.length}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>SUB-TOTAL:</Text>
            <Text>${formatNumber(subtotal)}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>SALDO:</Text>
            <Text>${formatNumber(saldo)}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL A PAGAR:</Text>
            <Text style={styles.totalValue}>
              ${formatNumber(total + saldo)}
            </Text>
          </View>

          {saldo > 0 && (
            <Text style={styles.debtNote}>
              * El saldo incluye deudas anteriores del cliente
            </Text>
          )}
        </View>

        {/* Observaciones */}
        <View style={{ marginTop: 10 }}>
          <Text style={styles.infoLabel}>ESTADO:</Text>
          <Text style={styles.infoText}>
            {order.status || "No especificado"}
          </Text>
        </View>

        {/* Pie de página */}
        <View style={styles.footer}>
          <Text>--- Gracias por su compra ---</Text>
          <Text>
            Impreso el {new Date().toLocaleDateString()} a las{" "}
            {new Date().toLocaleTimeString()}
          </Text>
        </View>

        {/* Pie de página fijo */}
        <View style={styles.pageFooter} fixed>
          <Image src="/logo3.png" style={styles.footerLogo} />
          <Text style={styles.footerText}>loud</Text>
        </View>
      </Page>
    </Document>
  );
};

export default FacturaPDF;
