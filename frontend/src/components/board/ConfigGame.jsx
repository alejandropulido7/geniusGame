import React, { useContext, useEffect, useState } from 'react'
import {setCookie, getCookie } from '../../utils/cookies'
import {createSession, getSession} from '../../services/sessionService'
import { Link, useNavigate } from 'react-router-dom';
import {generateUUID} from '../../utils/shared';
import {CHALLENGES_IN_BOARD} from '../../utils/constants'

const ConfigGame = () => {

    const [isPreviousGame, setIsPreviousGame] = useState(false);
    const [configGame, setConfigGame] = useState({
        min_to_answer: 1,
        lenght_board: 9,
        amount_challenges: 5,
        challenges_in_board: JSON.stringify(CHALLENGES_IN_BOARD)
    });
    const navigate = useNavigate();


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setConfigGame((prevDatos) => ({
          ...prevDatos,
          [name]: value,
        }));
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('authToken');
        const sessionCreated = await createSession(configGame, token);
        console.log(sessionCreated);
        if(sessionCreated){
            setCookie('idDevice-GG', sessionCreated.idHost, 1);
            localStorage.setItem('authToken', sessionCreated.token);
            navigate('/board/'+sessionCreated.idRoom);
        }
    }

    const entryPreviousSession = (code) => {
        setIsPreviousGame(true)
    }


    return (
        <div>
            {!isPreviousGame ? 
            <div className='w-1/2 flex flex-col m-auto gap-4'>
                <div>
                    <Link to={'/'}>Atras</Link>
                </div>
                <div className='flex justify-between items-center gap-2'>
                    <label>Minutos para resolver los retos: </label>
                    <input className='input' min={1} max={2} type='number' name='min_to_answer' value={configGame.min_to_answer} onChange={handleInputChange}/>
                </div>
                <div className='flex justify-between items-center gap-2'>
                    <label>Cantidad de casillas: </label>
                    <input className='input' min={9} max={15} type='number' name='length_board' value={configGame.lenght_board} onChange={handleInputChange}/>
                </div>
                <div className='flex justify-between items-center gap-2'>
                    <label>Cantidad de retos x bandera: </label>
                    <input className='input' min={5} max={configGame.lenght_board} type='number' name='amount_challenges' value={configGame.amount_challenges} onChange={handleInputChange}/>
                </div>
                <div className='flex gap-3 my-3'>
                    <button className='btn' onClick={handleSubmit}>Start new game</button>
                    <button className='btn' onClick={() => setIsPreviousGame(true)} >Join to previous game</button>
                </div>
            </div>
            :
            <div>
                <button className='btn' onClick={() => setIsPreviousGame(false)}>Start new game</button>
                <div>
                    <label>Type session code: </label>
                    <input className='input' name='sessionCode' onChange={(e)=>entryPreviousSession(e.target.value)}/>
                </div>
            </div>
            }
        </div>
    )
}

export default ConfigGame
