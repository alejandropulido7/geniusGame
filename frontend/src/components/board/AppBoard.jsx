import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/GlobalContext';

const AppBoard = () => {

    const {socket} = useContext(AuthContext);

    useEffect(() => {
        if(socket){
            console.log('socket null')
            socket.emit('prueba', 'test desde front');
        }
    }, [])

    return (
        <div>
            <h1>Genius game</h1>
            <Link to={'room'}>Start new game</Link>
            <br />
            <Link to={'player'}>Entry as Player</Link>
        </div>
    )
}

export default AppBoard
