import axios from 'axios'

export const api = axios.create({
    // baseURL: 'https://backend-chat-room.onrender.com'
    baseURL: 'http://localhost:3333'
})