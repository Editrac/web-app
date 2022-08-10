import axios, { AxiosResponse } from 'axios';

export default {
  signup: <V>(data: V) => axios.post("/api/auth/signup", data),
  validateOtp: <V>(data: V) => axios.post("/api/auth/otp", data),
  setPassword: <V>(data: V) => axios.post("/api/auth/password", data),
  signin: <V>(data: V) => axios.post("/api/auth/signin", data),
};