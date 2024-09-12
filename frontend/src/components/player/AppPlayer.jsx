import React from 'react'
import GlobalState from '../../context/GlobalState'
import { Outlet } from 'react-router-dom'

const AppPlayer = () => {
  return (
    <div>
      <GlobalState>
        <Outlet/>
      </GlobalState>      
    </div>
  )
}

export default AppPlayer
