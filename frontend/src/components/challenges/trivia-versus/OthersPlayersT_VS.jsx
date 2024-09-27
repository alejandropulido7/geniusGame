import React from 'react'
import HideWord from '../common/HideWord';

const OtherPlayers_VS = ({correctAnswer}) => {
  return (
    <div>
      <HideWord word={correctAnswer} textButton={'Respuesta correcta'}/>
    </div>
  )
}

export default OtherPlayers_VS
