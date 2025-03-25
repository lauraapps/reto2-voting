import { ventaProductos } from "./bd.js";
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
  
  try {
    const { data: resultadoVenta1 } = await axios.get(`http://localhost:3001/consulta?vendedor=${vendedor}&producto=${producto}`);
    const { data: resultadoVenta2 } = await axios.get(`http://localhost:3002/consulta?vendedor=${vendedor}&producto=${producto}`);
    const { data: resultadoVenta3 } = await axios.get(`http://localhost:3003/consulta?vendedor=${vendedor}&producto=${producto}`);
    
    console.log(resultadoVenta1, resultadoVenta2, resultadoVenta3);
    const resultado = await logicaVoting([
      resultadoVenta1.mensaje,
      resultadoVenta2.mensaje,
      resultadoVenta3.mensaje,
    ]);
    
    if (resultado == -1) {
      return "En este momento el servicio no está disponible. Intente más tarde";
    } else {
      console.log(
        `Se entregó el resultado correcto: ${
          ventaProductos[vendedor - 1][producto - 1] == resultado
        }`
      );
      if (resultado==1){
        return `El vendedor ${vendedor}, ha vendido una unidad del producto ${producto}`;
      }
      return `El vendedor ${vendedor}, ha vendido ${resultado} unidades del producto ${producto}`;
    }
  } catch (error) {
    console.error("Error en la consulta de ventas", error);
    return "Error al obtener datos de ventas";
  }
}

async function logicaVoting(array) {
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
