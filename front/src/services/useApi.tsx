import axios from "axios";

const apiurl = "http://192.168.11.95:3005/" 

const api = axios.create({
  baseURL: apiurl,
});

export default api;