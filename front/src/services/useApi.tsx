import axios from "axios";

const apiurl = "http://127.0.0.1:8000/" 

const api = axios.create({
  baseURL: apiurl,
});

export default api;