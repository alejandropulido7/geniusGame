import React from 'react'

const PositionsTable = ({positionTable}) => {
  return (
    <div className="overflow-x-auto">
        <h3 className='font-bold text-lg my-2'>Posiciones</h3>
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-sm">
            <thead>
            <tr className="bg-blue-600 text-white text-left">
                <th className="py-3 px-4 uppercase font-semibold text-sm">Posición</th>
                <th className="py-3 px-4 uppercase font-semibold text-sm">Equipo</th>
                <th className="py-3 px-4 uppercase font-semibold text-sm">Tiempo</th>
                <th className="py-3 px-4 uppercase font-semibold text-sm">R/Correctas</th>
            </tr>
            </thead>
            <tbody>
            {positionTable.map((team, index) => (
                <tr key={index} className="border-b">
                <td className="py-3 px-4">{index+1}</td>
                <td className="py-3 px-4">{team.teamName}</td>
                <td className="py-3 px-4">{team.timeResponse}</td>
                <td className="py-3 px-4">{team.rightAnswers}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
  )
}

export default PositionsTable
