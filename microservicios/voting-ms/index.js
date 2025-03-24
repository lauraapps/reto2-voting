import {ventaProductos} from './bd'
const vendedor = 1; // ENTRADA
  const producto = 3; // ENTRADA
  const resultadoVenta1= consultaVenta1(vendedor,producto); // Llamado a consultaVenta1-ms
  const resultadoVenta2= consultaVenta2(vendedor,producto); // Llamado a consultaVenta2-ms
  const resultadoVenta3= consultaVenta3(vendedor,producto); // Llamado a consultaVenta3-ms
  console.log(resultadoVenta1, resultadoVenta2, resultadoVenta3);
  const resultado = logicaVoting([resultadoVenta1,resultadoVenta2,resultadoVenta3]);
  if(resultado == -1){
    console.log('En este momento el servicio no está disponible. Intente más tarde'); // SALIDA
  }
  else {
    console.log(`El vendedor ${vendedor}, ha vendido ${resultado} unidades del producto ${producto}`); // SALIDA
    console.log(`Se entregó el resultado correct: ${ventaProductos[vendedor-1][producto-1]==resultado}`); 
  }

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