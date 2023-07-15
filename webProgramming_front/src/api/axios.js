import axios from 'axios';

const { VITE_APP_SERVER_PORT } = import.meta.env;

console.log('VITE_APP_SERVER_PORT', VITE_APP_SERVER_PORT);
// Create axios instance
const instance = axios.create({
    baseURL: VITE_APP_SERVER_PORT,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;
