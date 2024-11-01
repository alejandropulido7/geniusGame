import React from 'react'

export const ChainWordsDescription = () => {
  return (
    <div className='flex flex-col text-left gap-4 md:text-md sm:text-sm'>
        <div className='my-3'>
            <p>Para formar una cadena de palabras, la letra de la palabra siguiente debe comenzar con la ultima letra de la palabra anterior</p>
            <p>Ejemplo:</p>
            <ul className='pl-6 space-y-1'>
                <li>Tema Naturaleza</li>
                <ul className='list-disc pl-6 space-y-1 flex gap-7 items-center'>
                    <li>Agu<span className='text-red-500'>a</span></li>
                    <li><span className='text-red-500'>A</span>rbo<span className='text-violet-500'>l</span></li>
                    <li><span className='text-violet-500'>L</span>od<span className='text-green-500'>o</span></li>
                    <li>etc..</li>
                </ul>
            </ul>
        </div>
        <h2 className='text-xl text-center my-2'>Instrucciones</h2>
        <div>
            <p className='btn-wood text-center text-white'>Para el equipo contrincante:</p>
            <ul className='list-disc pl-6 space-y-1'>
                <li>Debera escoger un tema, y una escribir palabra acorde al tema escogido</li>
            </ul>
        </div>
        <div>
            <p className='btn-wood text-center text-white'>Para el equipo retado:</p>
            <ul className='list-disc pl-6 space-y-1'>
                <li>Si no aceptas el reto, retornaras a la posicion anterior</li>
                <li>Despues de recibir la primera palabra, aparecera el miembro del equipo que debe empezar con la cadena de palabras</li>
                <li>Despues de escribir la palabra debe dar clic en el boton "Agregar palabra" y pasar el dispositivo al compañero que aparece en pantalla</li>
                <li>Cuando todos los miembros del equipo colocaron una palabra, es necesario dar clic en el boton "Terminar" antes de que se acabe el tiempo</li>
                <li>Despues de terminar el reto, el equipo contrincante validara si el reto fue completado correctamente, asi que SIN TRAMPAS</li>
                <li>Si el reto es completado correctamente la ficha avanza, de lo contrario se devuelve a la posicion anterior</li>
            </ul>
        </div>
        <p className='text-white rounded-md p-1 bg-yellow-600 text-sm text-center'>IMPORTANTE: Despues de que el equipo contrincante envie la primera palabra empieza a correr el tiempo</p>
    </div>
  )
}
