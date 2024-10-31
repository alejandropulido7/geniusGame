import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../../context/SocketProvider';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/modal/Modal';
import { ImExit } from "react-icons/im";

const PreventBackButton = ({isBoard=false}) => {
    const {token, socket} = useContext(SocketContext);
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        window.onpopstate = function () {
            window.history.go(1);
        };
      }, []);

      const exitGame = () => {
        localStorage.clear();
        if(!isBoard){
            socket?.emit('exitGamePlayer', socket?.id);
        }
        const path = isBoard ? '/board' : `/player/${token}`;
        navigate(path);
      }

  return (
    <div>
        <button className='btn bg-black text-white mb-5 absolute top-0 right-0' onClick={() => setOpenModal(true)}><ImExit size={18}/></button>
        <Modal open={openModal} onClose={setOpenModal}>
            <div>
                <p>¿Estás seguro de que quieres salir?</p>
                <div className='flex'>
                    <button className='btn ' onClick={exitGame}>Si</button>
                    <button className='btn' onClick={() => setOpenModal(false)}>No</button>
                </div>
            </div>
        </Modal>
    </div>
    )
};

export default PreventBackButton;