import React from 'react'
import HideWord from '../common/HideWord'

const OpponentInteractiveT = ({correctAnswer}) => {
  return (
    <div>
      <HideWord word={correctAnswer} textButton={'Respuesta correcta'}/>
    </div>
  )
}

export default OpponentInteractiveT
