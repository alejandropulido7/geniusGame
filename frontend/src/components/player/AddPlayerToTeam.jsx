import React, {useState} from 'react'

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
        <label className='flex items-center'>Miembros:</label>
        <div className='flex relative'>
          <input
            className='input' 
            type="text"
            value={newPLayer}
            onChange={(e) => setNewPlayer(e.target.value)}
            placeholder="Agrega miembros"
          />
          <button className='absolute right-0 top-4' onClick={addPlayer}>✅</button>
        </div>
      </div>
      <div>        
        <ul style={{listStyle: 'none'}}>
          {players.map((player, index) => (
            <li className='flex justify-between items-center m-1 px-3 py-1 border-b-2 rounded-md' key={index}>
              {player}
              <button onClick={() => removePlayer(index)}>❌</button>
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
