import axios from 'axios';

const API = axios.create({
  baseURL: 'https://ruvanta-omnidim-hr-agent.onrender.com', 
  withCredentials: true, // Send cookies
});

export default API;
