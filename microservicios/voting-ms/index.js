import { comision,precioProducto, ventaProductos } from "./bd.js";
import express from "express";
import axios from "axios";

const app = express();

app.get("/consulta", async (req, res) => { // Agregado async aquí
  const vendedorValor = parseInt(req.query.vendedor);
  const productoValor = parseInt(req.query.producto);
  
  console.log("Llamado a Microservicio Voting");

  if (isNaN(vendedorValor) || isNaN(productoValor)) {
    return res.status(400).json({ error: "Parámetros inválidos" });
  }

  try {
    const mensaje = await votingService(vendedorValor, productoValor);
    console.log("Respuesta: ", mensaje);
    res.json({ mensaje });
  } catch (error) {
    console.error("Error en votingService", error);
    res.status(500).json({ error: "Error en el servicio" });
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor en http://0.0.0.0:${PORT}`);
});

async function votingService( vendedor, producto) {
  const flag = setRandomFalse();
  try {
    const { data: resultadoVenta1 } = await axios.get(`http://localhost:3001/consulta?vendedor=${vendedor}&producto=${producto}&flag=${flag[0]}`);
    const { data: resultadoVenta2 } = await axios.get(`http://localhost:3002/consulta?vendedor=${vendedor}&producto=${producto}&flag=${flag[1]}`);
    const { data: resultadoVenta3 } = await axios.get(`http://localhost:3003/consulta?vendedor=${vendedor}&producto=${producto}&flag=${flag[2]}`);
    
    console.log(resultadoVenta1, resultadoVenta2, resultadoVenta3);
    const resultadoCantidadProducto = await logicaVoting([
      resultadoVenta1.cantidadProducto,
      resultadoVenta2.cantidadProducto,
      resultadoVenta3.cantidadProducto,
    ]);

    const resultadoComision = await logicaVotingComision([
      resultadoVenta1.comison,
      resultadoVenta2.comison,
      resultadoVenta3.comison,
    ]);
    
 
      console.log(
        `Se entregó el resultado correcto: ${
          ventaProductos[vendedor - 1][producto - 1] * precioProducto[producto - 1] * comision[producto - 1] == resultadoComision
        }`
      );
      if (resultadoCantidadProducto==1){
        return `El vendedor ${vendedor}, ha vendido una unidad del producto ${producto}. Su comision es de ${resultadoComision}`;
      }
      return `El vendedor ${vendedor}, ha vendido ${resultadoCantidadProducto} unidades del producto ${producto}. Su comision es de ${resultadoComision}`;
  } catch (error) {
    console.error("Error en la consulta de ventas", error);
    return "Error al obtener datos de ventas";
  }
}

function logicaVoting(array) {
  const [a, b, c] = array;

  if (a === b || a === c) {
    return a;
  }
  if (b === c) {
    return b;
  }
  return -1;
}

async function logicaVotingComision(array) {
  const [a, b, c] = array;

  if (a === b || a === c) {
    if (a !== b || a !== c) {
      const msFallo = (a !== b ? 2 : 3);
      await axios.get(`http://localhost:3004/?fallo=${msFallo}`);
    }
    return a;
  }
  if (b === c) {
    await axios.get(`http://localhost:3004/?fallo=${1}`);
    return b;
  }
  await axios.get(`http://localhost:3004/?fallo=${4}`);
  return -1;
}

function setRandomFalse() {
  let arr = [true, true, true]; 
  let randomIndex = Math.floor(Math.random() * 3); 
  arr[randomIndex] = false; 
  return arr;
}
