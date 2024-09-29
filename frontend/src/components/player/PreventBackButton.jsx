import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../../context/SocketProvider';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/modal/Modal';

const PreventBackButton = () => {
    const {token, socket} = useContext(SocketContext);
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        window.onpopstate = function () {
            alert("No puedes");
            window.history.go(0); // Impide retroceder
        };
      }, []);

      const exitGame = () => {
        localStorage.clear();
        socket?.emit('exitGamePlayer', socket?.id);
        navigate(`/player/${token}`);
      }

  return (
    <div>
        <button className='btn' onClick={() => setOpenModal(true)}>Salir del juego</button>
        <Modal open={openModal} onClose={setOpenModal}>
            <div>
                <p>¿Estás seguro de que quieres salir?</p>
                <div className='flex'>
                    <button className='btn' onClick={exitGame}>Si</button>
                    <button className='btn' onClick={() => setOpenModal(false)}>No</button>
                </div>
            </div>
        </Modal>
    </div>
    )
};

export default PreventBackButton;