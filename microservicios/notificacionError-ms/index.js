import express from "express";

const app = express();

app.get("/", async (req, res) => {
    console.log("Llamado a Microservicio de notificación de error");
    const falloValor = parseInt(req.query.fallo);
    
    if (isNaN(falloValor)) {
        return res.status(400).json({ error: "Parámetro inválido" });
    }
  
  try {
    const mensaje = await notificacionFallo(falloValor);
    console.log('Respuesta: ', mensaje);
    res.json({ mensaje });
  } catch (error) {
    res.status(500).json({ error: "Error en el servicio" });
  }
});

const PORT = 3004;
app.listen(PORT, () => {
  console.log(`Servidor en http://0.0.0.0:${PORT}`);
});
export function notificacionFallo (componenteFallido) {
    if(componenteFallido==1){
        return 'Fallo en microservicio 1 ...';
    }else if(componenteFallido==2){
        return 'Fallo en microservicio 2 ...';
    } else if(componenteFallido==3){
        return 'Fallo en microservicio 3 ...';
    } else if(componenteFallido==4){
        return 'Fallo general en el sistema. Estableciendo conexión con todos los microservicios ...';
    }
}