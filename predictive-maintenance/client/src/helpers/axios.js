import axios from 'axios';
import config from "../config";

const customHeader = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json, text/plain, /',
});

export function api() {
  let opts = {
    baseURL: config.api.trim(),
    headers: customHeader(),
  };
  return axios.create(opts);
}

export function catchHandler(e) {
  if (e.code === 401) {
  }
  throw e;
}
