import { ventaProductos } from './bd-replica.js';
import express from "express";

const app = express();

app.get("/consulta", (req, res) => {
    const vendedorValor = parseInt(req.query.vendedor);
    const productoValor = parseInt(req.query.producto);
    
    if (isNaN(vendedorValor) || isNaN(productoValor)) {
        return res.status(400).json({ error: "Parámetros inválidos" });
    }
    const responseMicro= consultaVenta(vendedorValor, productoValor) ;
    console.log(`Llamado a Microservicio consulta 2. 
    Parámetros de consulta: 
        Vendedor: ${vendedorValor} , Producto: ${productoValor}
    Respuesta: ${responseMicro}`);
    res.json({ mensaje: responseMicro});
});

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Servidor en http://0.0.0.0:${PORT}`);
});

function consultaVenta(vendedor, producto) {
    const matriz = ventaProductos;
    let probabilidad = Math.random() < 0.5 ? Math.random() : 0;
    
    if (probabilidad <= 0.8) {
        return matriz[vendedor - 1][producto - 1];
    } else {
        return Math.floor(Math.random() * 11);
    }
}