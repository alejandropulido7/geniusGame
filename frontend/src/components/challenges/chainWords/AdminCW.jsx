import React, { useEffect, useState } from 'react'

const AdminCW = ({arrayWords}) => {

  return ( 
    <>
      {arrayWords.length > 0 && 
      <div>
        <p>Listado de palabras</p>
        <ul>
            {arrayWords.map((palabra, index) => (
                <li key={index}>{palabra}</li>
            ))}
        </ul>
      </div>
      }
    </>    
  )
}

export default AdminCW
