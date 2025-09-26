import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://cureconnect-0oy1.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Forwarded-Proto': 'https'
  },
  withCredentials: true
});

export default instance;