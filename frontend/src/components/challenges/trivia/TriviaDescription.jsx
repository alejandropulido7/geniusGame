import React from 'react'

export const TriviaDescription = () => {
  return (
    <div className='flex flex-col text-left gap-4'>
        <h2 className='text-xl text-center my-2'>Instrucciones</h2>
        <p className='btn-wood text-center text-white'>Para el equipo retado:</p>
        <ul className='list-disc pl-6 space-y-1'>
            <li>Despues de que se acepte el reto empieza a correr el tiempo</li>
            <li>Aparecera una pregunta en esta pantalla con las opciones de respuesta</li>
            <li>Debe responder desde su dispsitivo antes de que se acabe el tiempo</li>
            <li>Si se elige la respuesta correcta, la ficha avanza, de lo contrario la ficha retorna a la posicion anterior</li>
            <li>Si no aceptas el reto, retornaras a la posicion anterior</li>
        </ul>
    </div>
  )
}
