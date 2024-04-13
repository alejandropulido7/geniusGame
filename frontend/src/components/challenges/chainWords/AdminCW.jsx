import React, { useEffect, useState } from 'react'

const AdminCW = ({arrayWords}) => {

  return (     
    <ul>
        {arrayWords.map((palabra, index) => (
            <li key={index}>{palabra}</li>
        ))}
    </ul>
  )
}

export default AdminCW
