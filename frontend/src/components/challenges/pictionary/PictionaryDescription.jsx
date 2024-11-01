import React from 'react'

export const PictionaryDescription = () => {
  return (
    <div className='flex flex-col text-left gap-4'>
        <h2 className='text-xl text-center my-2'>Instrucciones</h2>
        <div>
          <p className='btn-wood text-center text-white'>Para el equipo contrincante:</p>
          <ul className='list-disc pl-6 space-y-1'>
              <li>Debera escribir una palabra o frase para que el equipo retado la dibuje</li>
              <li>Debe elegir cual miembro del equipo debe dibujar</li>
          </ul>
        </div>
        <div>
          <p className='btn-wood text-center text-white'>Para el equipo retado:</p>
          <ul className='list-disc pl-6 space-y-1'>
              <li>Si no aceptas el reto, retornaras a la posicion anterior</li>
              <li>Despues de recibir la palabra o frase, aparecera el miembro del equipo que debe dibujar</li>
              <li>Tambien aparece un boton que mostrara la palabra o frase secreta, este boton SOLO lo puede presionar el miembro del equipo que hara el reto</li>
              <li>Solo cuando los demas miembros del equipo adivinen la palabra o frase, se puede dar clic en el boton "Terminar"</li>
              <li>Despues de terminar el reto, el equipo contrincante validara si el reto fue completado correctamente, asi que SIN TRAMPAS</li>
              <li>Si el reto es completado correctamente, la ficha avanza, de lo contrario se devuelve a la posicion anterior</li>
          </ul>
        </div>
        <p className='text-white rounded-md p-1 bg-yellow-600 text-sm text-center'>IMPORTANTE: Despues de que el equipo contrincante envie le titulo de la pelicula empieza a contar el tiempo</p>
    </div>
  )
}
