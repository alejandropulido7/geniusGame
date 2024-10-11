import React from 'react'
import Flag from '../../board/Flag'
import { findFlagProperties } from '../../../utils/constants'

export const FlagsPlayer = ({flagsPlayer}) => {


    return (
        <div className='flex justify-center'>
            {(flagsPlayer && flagsPlayer.length > 0) &&
             flagsPlayer.map((flag) => {
                return (
                    <Flag ß
                    key={flag}
                    color={findFlagProperties(flag).color} 
                    shadow={findFlagProperties(flag).shadow}
                    height={24} width={32}
                    />
                )
            })}
            {(!flagsPlayer || flagsPlayer.length == 0) &&
                <div>No tienes por ahora</div>
            }
        </div>
    )
}
