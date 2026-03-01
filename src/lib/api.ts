import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://skill-bridge-server-tau.vercel.app/api", 
  headers: {
    "Content-Type": "application/json",
  },
});


export default api;