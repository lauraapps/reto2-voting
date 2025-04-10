import axios from "axios";
import { comision, precioProducto, ventaProductos } from "./bd.js";

export const handler = async (event) => {
  const queryParams = event.queryStringParameters || {};
  const vendedorValor = parseInt(queryParams.vendedor);
  const productoValor = parseInt(queryParams.producto);

  console.log(`Llamado a a Lambda Voting. Parámetros de consulta:  Vendedor: ${vendedorValor} , Producto: ${productoValor}`);

  if (isNaN(vendedorValor) || isNaN(productoValor)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Parámetros inválidos" }),
    };
  }

  try {
    const mensaje = await votingService(vendedorValor, productoValor);
    console.log("Respuesta:", mensaje);
    return {
      statusCode: 200,
      body: JSON.stringify({ mensaje }),
    };
  } catch (error) {
    console.error("Error en votingService", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error en el servicio" }),
    };
  }
};

async function votingService(vendedor, producto) {
  const flag = setRandomFalse();
  try {
    const [res1, res2, res3] = await Promise.all([
      axios.get(`https://ndjbsoq6xjztv3qvzeqiugtuy40wzmrx.lambda-url.us-east-2.on.aws/consulta?vendedor=${vendedor}&producto=${producto}&flag=${flag[0]}`),
      axios.get(`https://lbwsmrcn622gskv7mklbimkz2y0aimjd.lambda-url.us-east-2.on.aws/consulta?vendedor=${vendedor}&producto=${producto}&flag=${flag[1]}`),
      axios.get(`https://ouzzwnkuln6hf5msmmnp3vb7xi0wgahn.lambda-url.us-east-2.on.aws/consulta?vendedor=${vendedor}&producto=${producto}&flag=${flag[2]}`),
    ]);

    const resultadoCantidadProducto = await logicaVoting([
      res1.data.cantidadProducto,
      res2.data.cantidadProducto,
      res3.data.cantidadProducto,
    ]);

    const resultadoComision = await logicaVotingComision([
      res1.data.comison,
      res2.data.comison,
      res3.data.comison,
    ]);
    console.log(
      `Resultado correcto: ${
        Math.round(ventaProductos[vendedor - 1][producto - 1] * precioProducto[producto - 1] * comision[producto - 1]) == resultadoComision
      }`
    );

    if (resultadoCantidadProducto === 1) {
      return `El vendedor ${vendedor}, ha vendido una unidad del producto ${producto}. Su comision es de ${resultadoComision}`;
    }
    return `El vendedor ${vendedor}, ha vendido ${resultadoCantidadProducto} unidades del producto ${producto}. Su comision es de ${resultadoComision}`;
  } catch (error) {
    console.error("Error en la consulta de ventas", error);
    return "Error al obtener datos de ventas";
  }
}

function logicaVoting([a, b, c]) {
  if (a === b || a === c) return a;
  if (b === c) return b;
  return -1;
}

async function logicaVotingComision([a, b, c]) {
  if (a === b || a === c) {
    if (a !== b || a !== c) {
      const msFallo = a !== b ? 2 : 3;
      notificacionFallo(msFallo);
    }
    return a;
  }
  if (b === c) {
    notificacionFallo(1);
    return b;
  }
  notificacionFallo(4);
  return -1;
}

function setRandomFalse() {
  const arr = [true, true, true];
  const i = Math.floor(Math.random() * 3);
  arr[i] = false;
  return arr;
}

function notificacionFallo (componenteFallido) {
  if(componenteFallido==1){
      console.log('Fallo en microservicio 1');
  }else if(componenteFallido==2){
    console.log('Fallo en microservicio 2');
  } else if(componenteFallido==3){
    console.log('Fallo en microservicio 3');
  } else if(componenteFallido==4){
    console.log('Fallo general en el sistema. Estableciendo conexión con todos los microservicios ...');
  }
}