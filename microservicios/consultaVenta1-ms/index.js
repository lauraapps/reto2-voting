import { comision,precioProducto, ventaProductos } from './bd.js';
import express from "express";

const app = express();

app.get("/consulta", (req, res) => {
    const vendedorValor = parseInt(req.query.vendedor);
    const productoValor = parseInt(req.query.producto);
    const flag = req.query.flag;

    if (isNaN(vendedorValor) || isNaN(productoValor) || flag==undefined) {
        return res.status(400).json({ error: "Parámetros inválidos" });
    }
    const responseCantidadVenta = consultaVenta(vendedorValor, productoValor) ;
    const responseComision= Math.round(calculoComision(productoValor-1, responseCantidadVenta, flag) );
    console.log(`Llamado a Microservicio consulta 1. 
    Parámetros de consulta: 
        Vendedor: ${vendedorValor} , Producto: ${productoValor}, Flag: ${flag}
    Respuesta: 
        Cantidad productos vendidos: ${responseCantidadVenta}, Comisión: ${responseComision}`);
    res.json({ cantidadProducto: responseCantidadVenta, comison: responseComision});
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor en http://0.0.0.0:${PORT}`);
});

function consultaVenta(vendedor, producto) {
    const matriz = ventaProductos;
    return matriz[vendedor - 1][producto - 1];
}

function calculoComision (prodArray, cantidadVenta, flag){
    let probabilidad = 0;
    if (flag=='false'){
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