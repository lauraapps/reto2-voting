import {crearUsuarios,generarMatriz,generarBooleanos} from './BD.js';
import { notificarFallo } from './notificarFallaServicio.js';
import {consultaVenta} from './consulta1.js';
import express from "express";

const app = express();

app.get("/", (req, res) => {
    console.log('Llamado a Microservicio Voting');
  res.json({ mensaje: "¡Hola desde EC2 con Node.js!" });
});

function logicaVoting(array) {
  const [a, b, c] = array;

  if (a === b || a === c) {
    if (a !== b || a !== c) {
      notificarFallo(a !== b ? 2 : 3);
    }
    return a;
  }
  if (b === c) {
    notificarFallo(1);
    return b;
  }
  notificarFallo(4);
  return -1;
}



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor en http://0.0.0.0:${PORT}`);
  const vendedor = 1;
  const producto = 3;
  const numUsuarios= 10;
  const usuarios = crearUsuarios(numUsuarios);
  console.log(usuarios);
  const numProductos = 5; // Número de columnas
  const productos = generarMatriz(numUsuarios, numProductos);
  console.log(productos);
  const flags = generarBooleanos();
  console.log(flags);
  const resultadoVenta1= consultaVenta(productos,vendedor,producto,flags[0]);
  const resultadoVenta2= consultaVenta(productos,vendedor,producto,flags[1]);
  const resultadoVenta3= consultaVenta(productos,vendedor,producto,flags[2]);
  console.log(resultadoVenta1, resultadoVenta2, resultadoVenta3);
  const resultado = logicaVoting([resultadoVenta1,resultadoVenta2,resultadoVenta3]);
  if(resultado == -1){
    console.log('En este momento el servicio no está disponible. Intente más tarde')
  }
  else {
    console.log(`El vendedor ${vendedor}, ha vendido ${resultado} unidades del producto ${producto}`);
    console.log(`Resultado esperado: ${productos[vendedor-1][producto-1]}`);
    console.log(`Se entregó el resultado correct: ${productos[vendedor-1][producto-1]==resultado}`);
  }
  
});
