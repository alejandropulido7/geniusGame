import React from 'react'

const AdminW = ({wordReady, word}) => {

    const hideWord = ' _ '.repeat(word.length);
  
    return (
      <div>
        <p>{hideWord}</p>
        {!wordReady && <p>Esperando al equipo que enviará la canción...</p>}
      </div>
    )
  }
  

export default AdminW
