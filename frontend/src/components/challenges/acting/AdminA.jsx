import React from 'react'

const AdminA = ({wordReady, word}) => {

    const hideWord = ' _ '.repeat(word?.length);
  
    return (
      <div>
        <p>{hideWord}</p>
        {!wordReady && <p>Esperando al equipo que enviará la película...</p>}
      </div>
    )
  }
  

export default AdminA
