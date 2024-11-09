import React, { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../../../context/SocketProvider';

const AdminA = ({wordReady, word, movieImage}) => {

    // const hideWord = ' _ '.repeat(word?.length);
    const hideWord = word.split('')
                .map((char) => char == ' ' ? ' . ' : ' _ ');
    
    const amountWords = word.split(' ').length;
    const [showMovie, setShowMovie] = useState(false);
    const {socket} = useContext(SocketContext);

    useEffect(() => {
      socket?.on('stopChallenge', (dataStop) => {
        setShowMovie(true);
      });
      socket?.on('notPassChallenge', (data) => {
        setShowMovie(true);
      })
      localStorage.setItem('acting-admin-GG', JSON.stringify({showMovie}));
    }, [showMovie]);

    useEffect(() => {
      const properties = JSON.parse(localStorage.getItem('acting-admin-GG'));
      if(properties != null){
          setShowMovie(properties.showMovie);
      }
    },[])
  
    return (
      <div>
        {
          !showMovie 
          ?
          <div className='flex flex-col gap-5 my-10'>
            <p className='text-2xl text-red-600'>{hideWord}</p>
            <p>Cantidad de palabras {amountWords}</p>
            {!wordReady && <p>Esperando al equipo que enviará la película...</p>}
          </div>
          :
          <div>
            <p>La pelicula era:</p>
            <p>{word}</p>
            <img src={movieImage} className="m-auto w-80 h-80 object-cover" alt={word} />
          </div>
        }
      </div>
    )
  }
  

export default AdminA
