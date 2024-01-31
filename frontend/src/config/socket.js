import { io } from 'socket.io-client';

const backend = import.meta.env.VITE_BACKEND || 'http://192.168.1.5:5000';
const socket = io(backend);

export default socket;