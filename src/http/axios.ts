import axios from "axios";

const $axios = axios.create({
  baseURL: `${process.env.API_URL!}/api`,
  withCredentials: true,
});

export default $axios;
