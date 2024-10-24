import React, {useState} from 'react'
import { FaUserCheck } from "react-icons/fa6";
import { IoMdAddCircle } from "react-icons/io";
import { FaUserPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const AddPlayerToTeam = ({players, setPlayers}) => {

  const [newPLayer, setNewPlayer] = useState('');
  const [error, setError] = useState('');

  const addPlayer = () => {
    if (newPLayer.trim() !== '' && newPLayer.length > 2) {
      if(!players.includes(newPLayer)){
        setError('');
        setPlayers([...players, newPLayer]);
      } else {
        setError('Already exist that player in your team');
      }
      setNewPlayer('');
    }
    
  };

  const removePlayer = (index) => {
    const newPlayers = [...players];
    newPlayers.splice(index, 1);
    setPlayers(newPlayers);
  };

  return (
    <>
      <div className='flex justify-between'>
        <div className='flex items-center gap-2'><FaUserPlus size={22}/><p>Miembros:</p></div>
        <div className='flex relative'>
          <input
            className='input' 
            type="text"
            value={newPLayer}
            onChange={(e) => setNewPlayer(e.target.value)}
            placeholder="Agrega miembros"
          />
          <button className='absolute right-0 top-4' onClick={addPlayer}><IoMdAddCircle size={26}/></button>
        </div>
      </div>
      <div>        
        <ul style={{listStyle: 'none'}}>
          {players.map((player, index) => (
            <li className='flex justify-between items-center my-3 px-3 py-3 shadow-md rounded-md' key={index}>
              <FaUserCheck size={22}/> Miembro {index+1}: {player}
              <button onClick={() => removePlayer(index)}><MdDelete color='red' size={24}/></button>
            </li>
          ))}
        </ul>
      </div>  
      { error != "" &&
        <div>
          <p>{error}</p>
      </div>
      }    
    </>
  )
}

export default AddPlayerToTeam
