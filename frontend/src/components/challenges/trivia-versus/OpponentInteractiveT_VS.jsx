import React from 'react'
import HideWord from '../common/HideWord'

const OpponentInteractiveT_VS = ({correctAnswer}) => {
  return (
    <div>
      <HideWord word={correctAnswer} textButton={'Respuesta correcta'}/>
    </div>
  )
}

export default OpponentInteractiveT_VS
