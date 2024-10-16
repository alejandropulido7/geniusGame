import React from 'react'
import { FlagsPlayer } from '../challenges/common/FlagsPlayer'

export const DataTeam = ({codeSesion, teamName, flagActive, flagsObtained, colorTable}) => {
  return (
    <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-sm">
            <thead>
            <tr className="text-white text-center" style={{backgroundColor: colorTable}}>
                <th className="py-3 px-4 uppercase font-semibold text-sm">Session</th>
                <th className="py-3 px-4 uppercase font-semibold text-sm">Tu equipo</th>
                <th className="py-3 px-4 uppercase font-semibold text-sm">Ruta</th>
                <th className="py-3 px-4 uppercase font-semibold text-sm">Tus banderas</th>
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
