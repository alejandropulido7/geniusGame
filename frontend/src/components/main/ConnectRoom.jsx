import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'

const ConnectRoom = () => {

  const [tokenAdmin, setTokenAdmin] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if(tokenAdmin != ''){
      navigate('/player/'+tokenAdmin);
    }
  };

  return (
    <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-gray-700">Token</label>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setTokenAdmin(e.target.value)}
          placeholder="Enter your token"
        />
      </div>
      <button type='submit' className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300">
        Join Room
      </button>
    </form>
  )
}

export default ConnectRoom
