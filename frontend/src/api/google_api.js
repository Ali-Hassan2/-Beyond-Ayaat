import axios from "axios";

const api = axios.create({
  baseURL: `http://localhost:3004/user`,
});
export const googleAuth = (code) => api.post("/google", { code });
