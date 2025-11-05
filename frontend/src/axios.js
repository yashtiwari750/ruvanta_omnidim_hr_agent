import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000', // Your backend base URL
  withCredentials: true, // Send cookies
});

export default API;
