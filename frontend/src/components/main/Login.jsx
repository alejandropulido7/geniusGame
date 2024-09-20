import React, {useContext, useState} from 'react'
import {loginService} from '../../services/authServices';
import {useNavigate} from 'react-router-dom'
import { setCookie } from '../../utils/cookies';

const Login = () => {

  const [email, setEmail] = useState('codingproactive@mail.com');
  const [password, setPassword] = useState('1234');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userAuthenticated = await loginService(email, password);
    if(userAuthenticated){
      setCookie('token', userAuthenticated.token); // Llamada para guardar el token y conectar el socket
      navigate('/board');
    }

  };

  return (
    <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300">
        Login
      </button>
    </form>
  )
}

export default Login
