import React from 'react'
import { findFlagProperties } from '../../../utils/constants'

const StealFlag = ({flagStole, setFlagStole, flagsOpponent}) => {
  return (
    <>
        <label>Elige la bandera que quieres robar..</label>
        <select className='select' value={flagStole} onChange={(event) => setFlagStole(event.target.value)}>
            <option value="">Seleccione...</option>
            {flagsOpponent.map ((flag, index) => {
                return <option key={index} value={flag}>{findFlagProperties(flag).name}</option>
            })}
        </select>
    </>
  )
}

export default StealFlag
