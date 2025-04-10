import jwt from 'jsonwebtoken';
import axios from 'axios';

// Clave secreta para verificar el JWT
const SECRET_KEY = "qwertyuiopasdfghjklzxcvbnm123456";

export const handler = async (event) => {
    try {
        // Obtener la URL del evento
        const url = event.url || "";
        console.log("URL:", url);

        // Definir un patrón para extraer el UID del path
        const pattern = /^.*\/vendedor\/([a-zA-Z0-9-]+)\/.*$/;

        // Obtener el JWT del encabezado de autorización
        const authHeader = event.Authorization;
        console.log("authHeader", authHeader);
        if (!authHeader) {
            console.error("Authorization header no encontrado");
            return {
                statusCode: 401,
                body: JSON.stringify({ error: "Authorization header no encontrado" }),
            };
        }

        // Extraer el token del encabezado
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7, authHeader.length) : authHeader;
        console.log("token", token);

        // Decodificar y verificar el JWT
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, SECRET_KEY); // Verifica la firma del token
            console.log("Token decodificado:", decodedToken);
        } catch (error) {
            console.error("Error al verificar el JWT:", error.message);
            return {
                statusCode: 401,
                body: JSON.stringify({ error: "JWT inválido" }),
            };
        }

        // Comparar el claim del JWT con el UID del path
        const uidFromToken = decodedToken.seller_id; // Ajusta esto según la estructura del JWT
        if (!uidFromToken) {
            console.error("Claim 'seller_id' no encontrado en el JWT");
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Claim 'seller_id' no encontrado en el JWT" }),
            };
        }

        // Buscar el patrón en la URL
        const match = url.match(pattern);
        if (match) {
            // Extraer el UID
            const uid = match[1];
            if (uid !== uidFromToken) {
                console.error("El UID del path no coincide con el claim del JWT");
                return {
                    statusCode: 403,
                    body: JSON.stringify({
                        error: "El UID del path no coincide con el claim del JWT",
                    }),
                };
            }
            axios.get(`https://ndjbsoq6xjztv3qvzeqiugtuy40wzmrx.lambda-url.us-east-2.on.aws/consulta?vendedor=${vendedor}&producto=${producto}&flag=${flag[0]}`);
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: "Path param extracted successfully",
                    uid: uid,
                }),
            };
        } else {
            // Si no se encuentra el patrón
            console.error("Invalid URL format");
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "Invalid URL format",
                }),
            };
        }
    } catch (error) {
        // Manejo de errores
        console.error("An error occurred:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "An error occurred",
                error: error.message,
            }),
        };
    }
};