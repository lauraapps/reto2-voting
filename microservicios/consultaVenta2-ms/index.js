import { comision, precioProducto, ventaProductos } from "./bd.js";

export const handler = async (event) => {
  const queryParams = event.queryStringParameters || {};
  const vendedorValor = parseInt(queryParams.vendedor);
  const productoValor = parseInt(queryParams.producto);
  const flag = queryParams.flag;

  if (isNaN(vendedorValor) || isNaN(productoValor) || flag === undefined) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Parámetros inválidos" }),
    };
  }

  const responseCantidadVenta = consultaVenta(vendedorValor, productoValor);
  const responseComision = Math.round(
    calculoComision(productoValor - 1, responseCantidadVenta, flag)
  );

  console.log(`Llamado a Lambda consulta 2. 
  Parámetros de consulta: 
      Vendedor: ${vendedorValor} , Producto: ${productoValor}, Flag: ${flag}
  Respuesta: 
      Cantidad productos vendidos: ${responseCantidadVenta}, Comisión: ${responseComision}`);

  return {
    statusCode: 200,
    body: JSON.stringify({
      cantidadProducto: responseCantidadVenta,
      comison: responseComision,
    }),
  };
};

function consultaVenta(vendedor, producto) {
  return ventaProductos[vendedor - 1][producto - 1];
}

function calculoComision(prodArray, cantidadVenta, flag) {
  let probabilidad = 0;
  if (flag === "false") {
    probabilidad = Math.random();
  }

  if (probabilidad <= 0.8) {
    return cantidadVenta * precioProducto[prodArray] * comision[prodArray];
  } else {
    return cantidadVenta * precioProducto[prodArray] * getRandomFloat();
  }
}

function getRandomFloat() {
  return Math.random() * (0.2 - 0.001) + 0.001;
}
