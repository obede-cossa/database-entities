import axios from "axios"

const api = axios.create({
  baseURL: "/backend",
  headers: {
    "Content-Type": "application/json",
  },
})

export default api
