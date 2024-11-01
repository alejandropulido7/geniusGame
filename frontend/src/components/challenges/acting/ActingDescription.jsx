import React from 'react'
import { GrUpdate } from "react-icons/gr";

export const ActingDescription = () => {
  return (
    <div className='flex flex-col text-left gap-4'>
        <h2 className='text-xl text-center my-2'>Instrucciones</h2>
        <div>
          <p className='btn-wood text-center text-white'>Para el equipo contrincante:</p>
          <ul className='list-disc pl-6 space-y-1'>
              <li>Debera enviar el titulo de una pelicula para que el equipo retado la actue</li>
              <li>Aparecera una lista de 10 peliculas para escoger, si no encuentra una pelicula que le gustaria enviar, puede dar clic en el boton <GrUpdate/> para buscar en otro listado de 10</li>
              <li>Puede escribir su propia pelicula si asi lo desea</li>
              <li>Debe elegir cual miembro del equipo debe actuar la pelicula</li>
          </ul>
        </div>
        <div>
          <p className='btn-wood text-center text-white'>Para el equipo retado:</p>
          <ul className='list-disc pl-6 space-y-1'>
              <li>Si no aceptas el reto, retornaras a la posicion anterior</li>
              <li>Despues de recibir el titulo de la pelicula, aparecera el miembro del equipo que debe actuar la pelicula</li>
              <li>Tambien aparece un boton que mostrara la pelicula, este boton SOLO lo puede presionar el miembro del equipo que actuara la pelicula</li>
              <li>Solo cuando los demas miembros del equipo adivinen la pelicula, se puede dar clic en el boton "Terminar"</li>
              <li>Despues de terminar la actuacion, el equipo contrincante validara si el reto fue completado correctamente, asi que SIN TRAMPAS</li>
              <li>Si el reto es completado correctamente la ficha avanza, de lo contrario se devuelve a la posicion anterior</li>
          </ul>
        </div>
        <p className='text-white rounded-md p-1 bg-yellow-600 text-sm text-center'>IMPORTANTE: Despues de que el equipo contrincante envie le titulo de la pelicula empieza a contar el tiempo</p>
    </div>
  )
}
