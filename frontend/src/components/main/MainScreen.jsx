import React, {useEffect, useState} from 'react'
import Login from './Login';
import ConnectRoom from './ConnectRoom';
import { deleteCookie } from '../../utils/cookies';

const MainScreen = () => {
    const [activeTab, setActiveTab] = useState('login');

    useEffect(() => {
        localStorage.clear();
        deleteCookie('token');
        deleteCookie('idDevice-GG');
    })
    
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="w-96 p-5 bg-white rounded-lg shadow-lg">
            <div className="flex justify-center mb-4 border-b border-gray-200">
            <button
                className={`w-1/2 py-2 ${activeTab === 'login' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                onClick={() => setActiveTab('login')}
            >
                Login
            </button>
            <button
                className={`w-1/2 py-2 ${activeTab === 'tokenRoom' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                onClick={() => setActiveTab('tokenRoom')}
            >
                Token & Room
            </button>
            </div>
            <div className="p-4">
            {activeTab === 'login' ? <Login /> : <ConnectRoom />}
            </div>
        </div>
        </div>
    )
}

export default MainScreen
