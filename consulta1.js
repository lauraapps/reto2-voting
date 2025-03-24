export function consultaVenta (matriz, cliente, producto, flag) {
    let probabilidad = 0;
    if(!flag){
        probabilidad= Math.random(); // Genera un número entre 0 y 1
        //console.log(probabilidad);
    } 
    //console.log(probabilidad);
    if (probabilidad <= 0.8) {
        return matriz[cliente-1][producto-1]; // Retorna el valor existente en la matriz
    } else {
        return Math.floor(Math.random() * 11); // Genera un nuevo valor aleatorio entre 0 y 10
    }
}