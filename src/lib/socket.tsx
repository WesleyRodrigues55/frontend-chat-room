import { io } from 'socket.io-client';

const URL = 'https://backend-chat-room.onrender.com';
// const URL = 'http://localhost:3333';

export const socket = io(URL);