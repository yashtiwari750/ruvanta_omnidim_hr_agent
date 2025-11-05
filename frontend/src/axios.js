import axios from 'axios';

const API = axios.create({
  baseURL: 'https://ruvanta-hr-agent.onrender.com', 
  withCredentials: true, // Send cookies
});

export default API;
