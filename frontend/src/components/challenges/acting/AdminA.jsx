import React from 'react'

const AdminA = ({wordReady, word}) => {

    const hideWord = ' _ '.repeat(word?.length);
  
    return (
      <div>
        <p>{hideWord}</p>
        {!wordReady && <p>Waiting for the word...</p>}
      </div>
    )
  }
  

export default AdminA
