import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom';
import socket from '../config/socket';

const Menu = () => {

    const {idRoom} = useParams();
    const [winner, setWinner] = useState('');
    const [status, setStatus] = useState(null);

    useEffect(() => {
        socket.on('winGame', (data) => {
            setWinner(data.teamName);
        });

        socket.on('status', (data) => {
            setStatus(data);
        });

        socket.on('prueba', (data) => {
            setStatus(data);
        });

        return () => {
            socket.off('winGame');
        }
    }, []);

    return (
        <>
            {winner != '' && <div>El ganador es: {winner}</div>}
           {idRoom && <div>
            <h3>Menu</h3>
            <p>Status: {status}</p>
           </div>}
        </>
    )
}

export default Menu
