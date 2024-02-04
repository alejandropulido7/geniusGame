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
      <div>
        <input
          type="text"
          value={newPLayer}
          onChange={(e) => setNewPlayer(e.target.value)}
          placeholder="Add player into your team"
        />
        <button onClick={addPlayer}>Add</button>
      </div>
      <div>
        <h4>Players in team</h4>
        <ul style={{listStyle: 'none'}}>
          {players.map((player, index) => (
            <li key={index}>
              {player}
              <button onClick={() => removePlayer(index)}>Eliminar</button>
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
