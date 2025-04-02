import axios from "axios";

export const api = axios.create({
    baseURL: process.env.BACKEND_URL, 
    withCredentials: true 
  });
  