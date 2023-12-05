import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:5000'

const getConfig = (token) =>  {
  return {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  }
}

const adminLogin = (login, password) => {
  return axios.post(`${BASE_URL}/api/login`, { login, password }, getConfig(''))
};

const adminRegister = (login, password) => {
  return axios.post(`${BASE_URL}/api/register`, { login, password }, getConfig(''))
};

export {
  adminLogin,
  adminRegister
};