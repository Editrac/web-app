import axios from 'axios';

export default {
  getUser: () => axios.get("/api/me"),
  updateUser: <V extends { user: string, data: object }>(variables: V) => axios.put(`/api/user/${variables.user}`, variables.data),
  createProfile: <V>(data: V) => axios.post("/api/advisor/profile", data)
};