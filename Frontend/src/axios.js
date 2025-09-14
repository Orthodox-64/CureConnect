import axios from 'axios';

const instance = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Forwarded-Proto': 'https'
  },
  withCredentials: true
});

export default instance;