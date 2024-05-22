import axios from 'axios';

const api = axios.create({
  baseURL: process.env.CREATE_USER_ACCOUNT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
