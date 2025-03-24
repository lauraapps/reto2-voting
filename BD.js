export function crearUsuarios(numUsuarios) {
    return Array.from({ length: numUsuarios }, (_, i) => i + 1);
  }

export  function generarMatriz(numUsuarios, numProductos) {
    return Array.from({ length: numUsuarios }, () => 
      Array.from({ length: numProductos }, () => Math.floor(Math.random() * 11))
    );
  }
  
  export function generarBooleanos() {
    return [
      Math.random() < 0.5,
      Math.random() < 0.5,
      Math.random() < 0.5
  ];
}
