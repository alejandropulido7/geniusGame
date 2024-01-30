import React, { useState } from 'react'
import socket from '../../config/socket';

const OtherPlayers = () => {

    const [otherPlayers, setOtherPlayers] = useState([]);

    socket.on('otherPlayersJoinedRoom', (players) => {
        const otherplayers = players.filter(player => player.socketId != socket.id);
        setOtherPlayers(otherplayers);
    });


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
