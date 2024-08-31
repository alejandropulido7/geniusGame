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
      <div className='flex gap-4'>
        <label>Players in team</label>
        <input
          className='input' 
          type="text"
          value={newPLayer}
          onChange={(e) => setNewPlayer(e.target.value)}
          placeholder="Add player into your team"
        />
        <button className='btn' onClick={addPlayer}>Add</button>
      </div>
      <div>        
        <ul style={{listStyle: 'none'}}>
          {players.map((player, index) => (
            <li key={index}>
              {player}
              <button className='btn' onClick={() => removePlayer(index)}>X</button>
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
