import { io } from 'socket.io-client';

const backend = import.meta.env.VITE_BACKEND || 'http://localhost:5000';
const socket = io(backend, {auth: {token: 1234}});

export default socket;