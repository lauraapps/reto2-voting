# Reto 2: Lógica Voting

Para iniciar probar todos los microservicios en el repositorio local es necesario cambiarse a la rama feat/localhost y posteriormente ejecutar el comando

```
npm run start:all
```

## Pruebas locales
En la terminal o en postman colocar el curl.

El campo vendedor permitido es entre 1 y 10 
El campo producto permitido es entre 1 y 5

```
curl --location 'http://0.0.0.0:3000/consulta?vendedor=1&producto=3'
```