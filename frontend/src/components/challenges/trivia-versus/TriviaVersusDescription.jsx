import React from 'react'

export const TriviaVersusDescription = () => {
  return (
    <div className='flex flex-col text-left gap-4'>
        <div className='text-white rounded-md p-1 bg-yellow-600 text-sm text-center'>
            <p>En este reto de preguntas, apareceran 3 preguntas seguidas, despues de responder cada una, se debe esperar a que el contrincante responda, despues de esto aparecera la siguiente pregunta.</p>
            <p>El equipo que responda la mayor cantidad de preguntas en el menor tiempo posible, gana.</p>
        </div>
        <div>
          <h2 className='text-xl text-center my-2'>Instrucciones</h2>
          <p>Esta es tu oportunidad para robar una bandera de algun oponente</p>
          <ul className='list-disc pl-6 space-y-1'>
              <li>Despues de aceptar el reto, empezaran a aparecer las preguntas, asi que concentrate</li>
              <li>En este reto se enfrentan dos equipos, el equipo que gane le robara una bandera al equipo perdedor</li>
              <li>Si el equipo contrincante no tiene banderas, estaras arriesgando una de tus banderas. Si ganas, quedas en la posicion actual, si pierdes, te roban una de tus banderas</li>
              <li>Si el equipo que eliges como contrincante SI tiene banderas y ganas, te quedas con la bandera que elegiste</li>
              <li>Si los dos equipos respondieron correctamente la misma cantidad de preguntas, gana el que menor tiempo haya respondido</li>
              <li>Si los dos equipos no respondieron ninguna pregunta correctamente, el equipo retador se devuelve a la casilla anterior</li>
          </ul>
        </div>
    </div>
  )
}
