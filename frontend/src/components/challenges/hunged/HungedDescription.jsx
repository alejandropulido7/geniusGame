import React from 'react'

export const HungedDescription = () => {
  return (
    <div className='flex flex-col text-left gap-4'>
        <h2 className='text-xl text-center my-2'>Instrucciones</h2>
        <div>
          <p className='btn-wood text-center text-white'>Para el equipo contrincante:</p>
          <ul className='list-disc pl-6 space-y-1'>
              <li>Debera enviar una palabra o frase</li>
              <li>Cualquier miembro del equipo puede resolver el reto</li>
          </ul>
        </div>
        <div>
          <p className='btn-wood text-center text-white'>Para el equipo retado:</p>
          <ul className='list-disc pl-6 space-y-1'>
              <li>Si no aceptas el reto, retornaras a la posicion anterior</li>
              <li>Tienes 5 intentos para adivinar la palabra</li>
              <li>El boton _ representa un espacio</li>
              <li>Si el reto es completado correctamente la ficha avanza, de lo contrario se devuelve a la posicion anterior</li>
          </ul>
        </div>
        <p className='text-white rounded-md p-1 bg-yellow-600 text-sm text-center'>IMPORTANTE: Despues de que el equipo contrincante envie la palabra o frase empieza a correr el tiempo</p>
    </div>
  )
}
