import {ventaProductos} from './bd-replica'

export function consultaVenta ( cliente, producto) {
    const matriz = ventaProductos;
    let probabilidad = 0;
    if(Math.random() < 0.5){
        probabilidad= Math.random(); 
    } 
    if (probabilidad <= 0.8) {
        return matriz[cliente-1][producto-1]; 
    } else {
        return Math.floor(Math.random() * 11);
    }
}