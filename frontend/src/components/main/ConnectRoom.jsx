import React from 'react'

const ConnectRoom = () => {
  return (
    <form className="flex flex-col space-y-4">
      <div>
        <label className="block text-gray-700">Token</label>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your token"
        />
      </div>
      <div>
        <label className="block text-gray-700">Room</label>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter room"
        />
      </div>
      <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300">
        Join Room
      </button>
    </form>
  )
}

export default ConnectRoom
