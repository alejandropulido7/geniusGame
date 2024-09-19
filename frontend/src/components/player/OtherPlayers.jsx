import React, { useState, useContext, useEffect } from 'react'
import { SocketContext } from '../../context/SocketProvider';

const OtherPlayers = () => {

    const [otherPlayers, setOtherPlayers] = useState([]);
    const {socket} = useContext(SocketContext);

    useEffect(() => {
        socket?.on('otherPlayersJoinedRoom', (players) => {
            const otherplayers = players.filter(player => player.socketId != socket?.id);
            setOtherPlayers(otherplayers);
        });
    },[socket]);


    return (
        <div>
            {
                otherPlayers.map((player) => {
                    return (<p key={player.namePlayer}>{player.namePlayer}</p>)
                })
            }
        </div>
    )
}

export default OtherPlayers
