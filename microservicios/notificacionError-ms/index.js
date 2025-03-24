export function notificacionFallo (componenteFallido) {
    if(componenteFallido==1){
        console.log('Fallo en microservicio 1 ...')
    }else if(componenteFallido==2){
        console.log('Fallo en microservicio 2 ...')
    } else if(componenteFallido==3){
        console.log('Fallo en microservicio 3 ...')
    } else if(componenteFallido==4){
        console.log('Fallo general en el sistema. Restableciendo todos los microservicios ...')
    }
}