import React from 'react'
import Flag from '../../board/Flag'
import { findFlagProperties } from '../../../utils/constants'

export const FlagsPlayer = ({flagsPlayer}) => {


    return (
        <div>
            {(flagsPlayer && flagsPlayer.length > 0) &&
             flagsPlayer.map((flag) => {
                return (
                    <Flag ß
                    key={flag}
                    color={findFlagProperties(flag).color} 
                    shadow={findFlagProperties(flag).shadow}
                    height={10} width={18}
                    />
                )
            })}
        </div>
    )
}
