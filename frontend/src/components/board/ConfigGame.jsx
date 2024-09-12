import React, { useEffect, useState } from 'react'
import generateUniqueId from 'generate-unique-id';
import {setCookie, getCookie } from '../../utils/cookies'
import {createSession, getSession} from '../../services/sessionService'
import { Link, useNavigate } from 'react-router-dom';
import {generateUUID} from '../../utils/shared';

const ConfigGame = () => {

    const [isPreviousGame, setIsPreviousGame] = useState(false);
    const [configGame, setConfigGame] = useState({
        min_to_answer: 1,
        amount_box: 9,
        amount_challenges: 9,
    });
    const [idGame, setIdGame] = useState('');
    const navigate = useNavigate();

    useEffect(()=>{
        const uuid = generateUniqueId({
            length: 5,
            useLetters: false
        });        
        setIdGame(uuid);
    },[])

    useEffect(() => {

    },[configGame]);


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setConfigGame((prevDatos) => ({
          ...prevDatos,
          [name]: value,
        }));

        // setConfigGame({[name]: value});
    };

    const handleSubmit = async () => {
        const idHost = generateUUID(12);
        setCookie('idDevice-GG', idHost, 1);
        const sessionCreated = await createSession(idGame, idHost, configGame);
        if(sessionCreated){
            navigate('../room/'+idGame);
        }
    }

    const entryPreviousSession = (code) => {
        setIsPreviousGame(true)
    }


    return (
        <div>
            {!isPreviousGame ? 
            <div className='w-1/2 flex flex-col m-auto gap-4'>
                <h2>{idGame}</h2>
                <div>
                    <Link to={'/'}>Atras</Link>
                </div>
                <div className='flex justify-between items-center gap-2'>
                    <label>Minutos para resolver los retos: </label>
                    <input className='input' min={1} max={2} type='number' name='min_to_answer' value={configGame.min_to_answer} onChange={handleInputChange}/>
                </div>
                <div className='flex justify-between items-center gap-2'>
                    <label>Cantidad de casillas: </label>
                    <input className='input' min={9} max={15} type='number' name='amount_box' value={configGame.amount_box} onChange={handleInputChange}/>
                </div>
                <div className='flex justify-between items-center gap-2'>
                    <label>Cantidad de retos x bandera: </label>
                    <input className='input' min={9} max={configGame.amount_box} type='number' name='amount_challenges' value={configGame.amount_challenges} onChange={handleInputChange}/>
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
