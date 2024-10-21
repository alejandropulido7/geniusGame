import React from 'react'
import { FlagsPlayer } from '../challenges/common/FlagsPlayer'

export const DataTeam = ({codeSesion, teamName, flagActive, flagsObtained, colorTable}) => {
  return (
    <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md md:text-lg text-xs rounded-lg overflow-hidden">
            <thead>
            <tr className="text-white text-center" style={{backgroundColor: colorTable}}>
                <th className="py-3 px-4 uppercase font-semibold">Session</th>
                <th className="py-3 px-4 uppercase font-semibold">Tu equipo</th>
                <th className="py-3 px-4 uppercase font-semibold">Ruta</th>
                <th className="py-3 px-4 uppercase font-semibold">Tus banderas</th>
            </tr>
            </thead>
            <tbody>
                <tr className="border-b">
                    <td className="py-3 px-4">{codeSesion}</td>
                    <td className="py-3 px-4">{teamName}</td>
                    <td className="py-3 px-4">{flagActive}</td>
                    <td className="py-3 px-4"><FlagsPlayer flagsPlayer={flagsObtained}/></td>
                </tr>
            </tbody>
        </table>
    </div>
  )
}
